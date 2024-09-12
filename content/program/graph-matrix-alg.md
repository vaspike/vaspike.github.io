---
title: "有向图的邻接矩阵表示与路径可达分析"
date: 2024-09-12T14:23:49+08:00
draft: false
---

## 数据结构

- Node

```java
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用于图的邻接矩阵与搜索算法的数据结构, 只保留唯一标识这一种属性,减少内存开销
 * @author rxz
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Node<T> {
    T pre;
    T after;
}

```

- Pair

```java
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 放置两个平级数据, 此对象用于推入栈或加入队列, 简化算法可读性
 * @param <K> /
 * @param <V> /
 */
@Data
@AllArgsConstructor
public class Pair<K, V> {
    private K key;
    private V value;

}
```

- GraphMatrixEntity

```java
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.List;

/**
 * 有向图的邻接矩阵对象
 * @param <T> Node节点的类型 一般为Long
 * @param <K> 原始对象集合的类型
 */
@Slf4j
@Data
public class GraphMatrixEntity<T,K> implements Serializable {
    /**
     * 原始node集合
     */
    private List<Node<T>> nodes;

    /**
     * 邻接矩阵对照尺, 是一个线性表
     */
    private List<T> standardRuler;

    /**
     * 有向图的邻接矩阵表示
     */
    private int[][] graph;

    /**
     * 有向图的所有头节点
     */
    private List<Integer> headNodeIndex;

    /**
     * 有向图的所有尾节点
     */
    private List<Integer> tailNodeIndex;

    /**
     * 原始集合(此数据结构在算法中不会被赋值,请注意判空)
     */
    private List<K> rawList;
}
```

## 邻接矩阵转换与路径可达性分析

```java
import cn.hutool.core.collection.CollUtil;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 * 图的邻接矩阵转换算法与基于广度优先搜算法的路径可达节点查找算法实现
 * 使用此算法时必须声明泛型!
 *
 * @param <T> id的类型, 出入库单中总是为Long
 * @author rxz
 */
@Slf4j
public class GraphMatrixHandler<T,K> {
    public GraphMatrixEntity<T,K> matrixTransfer(List<Node<T>> nodeList) {
        GraphMatrixEntity<T,K> matrix = new GraphMatrixEntity<>();
        if (CollUtil.isEmpty(nodeList)) {
            return matrix;
        }
        //1. 去重nodes
        HashSet<Node<T>> nodes = new HashSet<>(nodeList);
        Set<T> allIdSet = new HashSet<>();
        //2. 将node集合转换为有向图, 用邻接矩阵的方式实现这个有向图
        // 2.1 构造一个辅助map,对node集合进行数据整理(支持null的存在)
        Map<T, Set<T>> map = new HashMap<>();
        nodes.forEach(node -> {
            Set<T> valueList = Optional.ofNullable(map.get(node.pre)).orElse(new HashSet<>());
            valueList.add(node.after);
            map.put(node.pre, valueList);

            allIdSet.add(node.pre);
            allIdSet.add(node.after);
        });
        // 2.2 初始化邻接矩阵
        List<T> nodeIdList = new ArrayList<>(allIdSet);
        int size = nodeIdList.size();
        int[][] graph = new int[size][size];
        for (int i = 0; i < graph.length; i++) {
            //i 严格对应preList的下标
            T iElement = nodeIdList.get(i);
            Set<T> matchingSet = map.get(iElement);
            for (int j = 0; j < graph[i].length; j++) {
                T jElement = nodeIdList.get(j);
                if (matchingSet != null && matchingSet.contains(jElement)) {
                    graph[i][j] = 1;
                } else {
                    graph[i][j] = 0;
                }
            }
        }
        //3. 获取所有的头节点和尾节点(的索引)
        List<Integer> headNodeIndex = new ArrayList<>();
        List<Integer> tailNodeIndex = new ArrayList<>();
        for (int i = 0; i < nodeIdList.size(); i++) {
            boolean tailFlag = false;
            boolean headFlag = false;
            for (int j = 0; j < nodeIdList.size(); j++) {
                if (!tailFlag && graph[i][j] == 1) {
                    tailFlag = true;
                }
                if (!headFlag && graph[j][i] == 1) {
                    headFlag = true;
                }
            }
            if (!tailFlag) {
                tailNodeIndex.add(i);
            }
            if (!headFlag) {
                headNodeIndex.add(i);
            }
        }

        //TODO: 如果有向图中没有任何端点(所有头和尾都存在环), 要如何处理?

        //4. 整理结果, 返回
        matrix.setGraph(graph);
        matrix.setNodes(nodeList);
        matrix.setStandardRuler(nodeIdList);
        matrix.setHeadNodeIndex(headNodeIndex);
        matrix.setTailNodeIndex(tailNodeIndex);

        return matrix;
    }

    /**
     * 使用广度优先算法, 在有向图的邻接矩阵中获取某个给定节点(索引)在n步数内可以到达的所有节点的索引
     *
     * @param nodeIdList    矩阵对照尺
     * @param graph         有向图的邻接矩阵
     * @param headNodeIndex 开始节点的索引集合(在对照尺中的下标)
     * @param n             步数
     * @return Map < 开始节点的索引,所有可达节点在矩阵对照尺中的下标>
     */
    public Map<Integer, List<Integer>> findNodesWithNPossiblePaths(List<T> nodeIdList, int[][] graph, List<Integer> headNodeIndex, int n) {
        Map<Integer, List<Integer>> nPathLengthNodeIndexMap = new HashMap<>();
        if (CollUtil.isEmpty(headNodeIndex)) {
            return nPathLengthNodeIndexMap;
        }
        for (Integer index : headNodeIndex) {
            T headNode = nodeIdList.get(index);
            List<Integer> reachableNodesOnPathN = bfs(nodeIdList, graph, headNode, n);
            nPathLengthNodeIndexMap.put(index, reachableNodesOnPathN);
        }
        return nPathLengthNodeIndexMap;
    }

    /**
     * 使用广度优先算法, 在有向图的邻接矩阵中获取某个给定节点(索引)在n步数内可以到达的所有节点的索引
     *
     * @param nodeIdList 矩阵对照尺
     * @param graph      有向图的邻接矩阵
     * @param startNode  开始节点的索引(在对照尺中的下标)
     * @param n          步数
     * @return 所有可达节点在矩阵对照尺中的下标
     */
    private List<Integer> bfs(List<T> nodeIdList, int[][] graph, T startNode, int n) {
        List<Integer> result = new ArrayList<>();
        int startIndex = nodeIdList.indexOf(startNode);
        Queue<Pair<Integer, Integer>> queue = new LinkedList<>();
        queue.offer(new Pair<>(startIndex, 0));

        while (!queue.isEmpty()) {
            Pair<Integer, Integer> current = queue.poll();
            int currentNodeIndex = current.getKey();
            int currentDepth = current.getValue();

            if (currentDepth < n) {
                for (int j = 0; j < graph[currentNodeIndex].length; j++) {
                    if (graph[currentNodeIndex][j] == 1) {
                        queue.offer(new Pair<>(j, currentDepth + 1));
                    }
                }
            } else if (currentDepth == n) {
                result.add(currentNodeIndex);
            }
        }
        return result;
    }

    /**
     * 使用广度优先搜索, 获取有向图中在给定步数m下, 可以到达给定节点(索引)的所有节点(索引)
     * @param nodeIdList 矩阵对照尺
     * @param graph 有向图的邻接矩阵
     * @param tailNodeIndex 最终到达节点的索引(在对照尺中的下标)
     * @param m 步数
     * @return 所有可出发节点在矩阵对照尺中的下标
     */
    public Map<Integer, List<Integer>> findNodesReachingCanReach(List<T> nodeIdList, int[][] graph, List<Integer> tailNodeIndex, int m) {
        Map<Integer, List<Integer>> goForwardnPathLengthNodeIndexMap = new HashMap<>();
        if (CollUtil.isEmpty(tailNodeIndex)) {
            return goForwardnPathLengthNodeIndexMap;
        }
        for (Integer index : tailNodeIndex) {
            T tailNode = nodeIdList.get(index);
            List<Integer> reachableNodesOnPathM = bfsToReachNode(nodeIdList, graph, tailNode, m);
            goForwardnPathLengthNodeIndexMap.put(index, reachableNodesOnPathM);
        }
        return goForwardnPathLengthNodeIndexMap;
    }


    private List<Integer> bfsToReachNode(List<T> nodeIdList, int[][] graph, T targetNode, int m) {
        List<Integer> result = new ArrayList<>();
        if (nodeIdList.isEmpty()) {
            return result;
        }
        int targetIndex = nodeIdList.indexOf(targetNode);
        Queue<Pair<Integer, Integer>> queue = new LinkedList<>();
        queue.offer(new Pair<>(targetIndex, 0));

        while (!queue.isEmpty()) {
            Pair<Integer, Integer> current = queue.poll();
            int currentNodeIndex = current.getKey();
            int currentDepth = current.getValue();

            if (currentDepth < m) {
                for (int j = 0; j < graph.length; j++) {
                    if (graph[j][currentNodeIndex] == 1) {
                        queue.offer(new Pair<>(j, currentDepth + 1));
                    }
                }
            } else if (currentDepth == m) {
                result.add(currentNodeIndex);
            }
        }
        return result;
    }

}

```