---
title: "Mybatis & Spring Data Jpa 多数据源配置"
date: 2024-09-13T09:07:06+08:00
draft: false
---

## Mybatis多数据源

- Master:

```kotlin
package com.xxx.xxx.kotlin.config.hikari.mybatis

import com.xxx.xxx.config.hikari.map.specific.MasterMyHikariSetting
import com.xxx.xxx.util.HikariSetting2ConfigUtils
import com.zaxxer.hikari.HikariDataSource
import org.apache.ibatis.session.SqlSessionFactory
import org.mybatis.spring.SqlSessionFactoryBean
import org.mybatis.spring.SqlSessionTemplate
import org.mybatis.spring.annotation.MapperScan
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.jdbc.datasource.DataSourceTransactionManager
import javax.sql.DataSource


/**
 * Master数据源加载
 * @author: River
 * @version: 1.0
 */
@Configuration
//扫receive包
@MapperScan(basePackages = ["com.xxx.xxx.mapper.master"], sqlSessionFactoryRef = "masterSqlSessionFactory")
class MasterDatasourceConfig {
    //获取日志对象
    val log: Logger = LoggerFactory.getLogger(this.javaClass)

    //初始化第一个数据源(master/接收方)
    @Bean(name = ["materDatasource"])
    @Primary
    fun masterDatasource(myHikariSetting: MasterMyHikariSetting): DataSource {
        log.info("正在初始化Master数据源...")
        return HikariDataSource(HikariSetting2ConfigUtils.mySetting2Config(myHikariSetting))
    }

    /**
     * mybatis sqlSession
     */
    @Bean(name = ["masterSqlSessionFactory"])
    @Primary
    fun sqlSessionFactory(@Qualifier("materDatasource") dataSource: DataSource): SqlSessionFactory? {
        val sqlBean = SqlSessionFactoryBean()
        sqlBean.setDataSource(dataSource)
//        val resolver = PathMatchingResourcePatternResolver()
//        sqlBean.setMapperLocations(*resolver.getResources("classpath:mapper/*.xml"))
        return sqlBean.`object`
    }

    @Bean(name = ["masterTransactionManager"])
    @Primary
    fun transactionManager(@Qualifier("materDatasource") dataSource: DataSource): DataSourceTransactionManager {
        return DataSourceTransactionManager(dataSource)
    }

    @Primary
    @Bean(name = ["masterSqlSessionTemplate"])
    fun sqlSessionTemplate(@Qualifier("masterSqlSessionFactory") sqlSessionFactory: SqlSessionFactory): SqlSessionTemplate {
        log.info("Master数据源SqlSessionFactory创建成功...")
        return SqlSessionTemplate(sqlSessionFactory)
    }
}
```

- Next:

```kotlin
package com.xxx.xxx.kotlin.config.hikari.mybatis

import com.xxx.xxx.kotlin.config.hikari.map.specific.SourceFirstMyHikariSetting
import com.xxx.xxx.kotlin.util.HikariSetting2ConfigUtils
import com.zaxxer.hikari.HikariDataSource
import org.apache.ibatis.session.SqlSessionFactory
import org.mybatis.spring.SqlSessionFactoryBean
import org.mybatis.spring.SqlSessionTemplate
import org.mybatis.spring.annotation.MapperScan
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.datasource.DataSourceTransactionManager
import javax.sql.DataSource

/**
 * 第一个副数据源加载
 * @author River
 * @since 1.0
 */
@Configuration
@MapperScan(basePackages = ["com.xxx.xxx.mapper.first"], sqlSessionFactoryRef = "sourceFirstSqlSessionFactory")
class SourceFirstDatasourceConfig {
    //获取日志对象
    val log: Logger = LoggerFactory.getLogger(this.javaClass)
    
    @Bean(name = ["sourceFirstDatasource"])
    fun sourceFirstDatasource(myHikariSetting: SourceFirstMyHikariSetting): DataSource {
        log.info("正在初始化第一个副数据源...")
        return HikariDataSource(HikariSetting2ConfigUtils.mySetting2Config(myHikariSetting))
    }

    /**
     * mybatis sqlSession
     */
    @Bean(name = ["sourceFirstSqlSessionFactory"])
    fun sqlSessionFactory(@Qualifier("sourceFirstDatasource") dataSource: DataSource): SqlSessionFactory? {
        val sqlBean = SqlSessionFactoryBean()
        sqlBean.setDataSource(dataSource)
//        val resolver = PathMatchingResourcePatternResolver()
//        sqlBean.setMapperLocations(*resolver.getResources("classpath:mapper/*.xml"))
        return sqlBean.`object`
    }

    @Bean(name = ["sourceFirstTransactionManager"])
    fun transactionManager(@Qualifier("sourceFirstDatasource") dataSource: DataSource): DataSourceTransactionManager {
        return DataSourceTransactionManager(dataSource)
    }

    @Bean(name = ["sourceFirstSqlSessionTemplate"])
    fun sqlSessionTemplate(@Qualifier("sourceFirstSqlSessionFactory") sqlSessionFactory: SqlSessionFactory): SqlSessionTemplate {
        log.info("第一个副数据源SqlSessionFactory创建成功...")
        return SqlSessionTemplate(sqlSessionFactory)
    }
}
```

## Spring Data Jpa 多数据源

- Primary:

```kotlin
package com.xxx.xxx.kotlin.config.hikari.jpa

import com.xxx.xxx.kotlin.config.hikari.map.specific.MasterMyHikariSetting
import com.xxx.xxx.kotlin.util.HikariSetting2ConfigUtils
import com.zaxxer.hikari.HikariDataSource
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.orm.jpa.HibernateProperties
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.orm.jpa.persistenceunit.PersistenceUnitManager
import org.springframework.orm.jpa.vendor.AbstractJpaVendorAdapter
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.annotation.EnableTransactionManagement
import javax.persistence.EntityManager
import javax.sql.DataSource


@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    entityManagerFactoryRef = "entityManagerFactoryPrimary",
    transactionManagerRef = "transactionManagerPrimary",
    basePackages = ["com.xxx.xxx.kotlin.repository.first"]
)
class PrimaryDatasourceConfig {
    //获取日志对象
    val log: Logger = LoggerFactory.getLogger(this::class.java)

    @Autowired
    private lateinit var jpaProperties: JpaProperties

    @Autowired
    private lateinit var hibernateProperties: HibernateProperties

    @Autowired(required = false)
    private val persistenceUnitManager: PersistenceUnitManager? = null


    @Bean(name = ["primaryDatasource"])
    fun primaryDatasource(myHikariSetting: MasterMyHikariSetting): DataSource {
        log.info("正在初始化JPA master数据源...")
        return HikariDataSource(HikariSetting2ConfigUtils.mySetting2Config(myHikariSetting))
    }

    private fun getVendorProperties(): Map<String?, Any?>? {
        return hibernateProperties.determineHibernateProperties(jpaProperties.properties, HibernateSettings())
    }

    @Bean(name = ["myEntityManagerFactoryBuilder"])
    fun customerEntityManagerFactoryBuilder(customerJpaProperties: JpaProperties): EntityManagerFactoryBuilder? {
        val adapter: AbstractJpaVendorAdapter = HibernateJpaVendorAdapter()
        return EntityManagerFactoryBuilder(
            adapter,
            customerJpaProperties.properties, persistenceUnitManager
        )
    }

    @Bean(name = ["entityManagerPrimary"])
    @Primary
    fun entityManager(@Qualifier("myEntityManagerFactoryBuilder")builder: EntityManagerFactoryBuilder, @Qualifier("primaryDatasource") datasource: DataSource): EntityManager? {
        return entityManagerFactoryPrimary(builder, datasource).getObject()!!.createEntityManager()
    }

    @Bean(name = ["entityManagerFactoryPrimary"])
    @Primary
    fun entityManagerFactoryPrimary(@Qualifier("myEntityManagerFactoryBuilder")builder: EntityManagerFactoryBuilder, @Qualifier("primaryDatasource") datasource: DataSource): LocalContainerEntityManagerFactoryBean {
        return builder
            .dataSource(datasource)
            .packages("com.xxx.xxx.kotlin.entity.master") //设置实体类所在位置
            .persistenceUnit("primary")
            .properties(getVendorProperties())
            .build()
    }
    @Bean(name = ["transactionManagerPrimary"])
    @Primary
    fun transactionManagerPrimary(@Qualifier("myEntityManagerFactoryBuilder")builder: EntityManagerFactoryBuilder, @Qualifier("primaryDatasource") datasource: DataSource): PlatformTransactionManager? {
        return JpaTransactionManager(entityManagerFactoryPrimary(builder, datasource).getObject()!!)
    }

}
```

- Next:

```kotlin
package com.xxx.xxx.kotlin.config.hikari.jpa

import com.xxx.xxx.kotlin.config.hikari.map.specific.SourceSecondMyHikariSetting
import com.xxx.xxx.kotlin.util.HikariSetting2ConfigUtils
import com.zaxxer.hikari.HikariDataSource
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.orm.jpa.HibernateProperties
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.annotation.EnableTransactionManagement
import javax.persistence.EntityManager
import javax.sql.DataSource

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    entityManagerFactoryRef = "entityManagerFactorySecondary",
    transactionManagerRef = "transactionManagerSecondary",
    basePackages = ["com.xxx.xxx.kotlin.repository.second"]
)
class SecondaryDatasourceConfig {
    //获取日志对象
    val log: Logger = LoggerFactory.getLogger(this::class.java)

    @Autowired
    private lateinit var jpaProperties: JpaProperties

    @Autowired
    private lateinit var hibernateProperties: HibernateProperties

    @Bean(name = ["secondaryDatasource"])
    fun secondaryDatasource(myHikariSetting: SourceSecondMyHikariSetting): DataSource {
        log.info("正在初始化JPA Second数据源...")
        return HikariDataSource(HikariSetting2ConfigUtils.mySetting2Config(myHikariSetting))
    }

    private fun getVendorProperties(): Map<String?, Any?>? {
        return hibernateProperties.determineHibernateProperties(jpaProperties.properties, HibernateSettings())
    }

    @Bean(name = ["entityManagerSecondary"])
    fun entityManager(
        builder: EntityManagerFactoryBuilder,
        @Qualifier("secondaryDatasource") datasource: DataSource
    ): EntityManager? {
        return entityManagerFactorySecondary(builder, datasource).getObject()!!.createEntityManager()
    }

    @Bean(name = ["entityManagerFactorySecondary"])
    fun entityManagerFactorySecondary(
        builder: EntityManagerFactoryBuilder,
        @Qualifier("secondaryDatasource") datasource: DataSource
    ): LocalContainerEntityManagerFactoryBean {
        return builder
            .dataSource(datasource)
            .packages("com.xxx.xxx.kotlin.entity.second") //设置实体类所在位置
            .persistenceUnit("secondary")
            .properties(getVendorProperties())
            .build()
    }

    @Bean(name = ["transactionManagerSecondary"])
    fun transactionManagerSecondary(
        builder: EntityManagerFactoryBuilder,
        @Qualifier("secondaryDatasource") datasource: DataSource
    ): PlatformTransactionManager? {
        return JpaTransactionManager(entityManagerFactorySecondary(builder, datasource).getObject()!!)
    }
}
```

## 工具类与其他实体

- `MasterMyHikariSetting` (其他以MyHikariSetting结尾的类与此类似,父类`BaseMyHikariSetting`属性与此相同):

```kotlin
package com.xxx.xxx.kotlin.config.hikari.map.specific

import com.xxx.xxx.kotlin.config.hikari.map.BaseMyHikariSetting
import com.xxx.xxx.kotlin.config.factory.YamlPropertySourceFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.PropertySource
import java.util.*

/**
 * master配置实体
 */
@Configuration
@PropertySource(value = ["classpath:datasources/datasources.yml"], factory = YamlPropertySourceFactory::class)
@ConfigurationProperties(prefix = "spring.datasources.master.hikari")
class MasterMyHikariSetting : BaseMyHikariSetting(){
    override var maximumPoolSize: Int? = null
    override var idleTimeout: Long? = null
    override var maxLifetime: Long? = null
    override var dataSourceProperties: Properties? = null
    override var driverClassName: String? = null
    override var jdbcUrl: String? = null
    override var username: String? = null
    override var password: String? = null

}
```

- `HikariSetting2ConfigUtils`:

```kotlin
package com.xxx.xxx.kotlin.util

import com.xxx.xxx.kotlin.config.hikari.map.BaseMyHikariSetting
import com.zaxxer.hikari.HikariConfig

/**
 * Hikari数据源配置工具类
 * @author River
 * @since 1.0
 */
class HikariSetting2ConfigUtils {
    companion object {
        /**
         * 自定义Hikari配置转换为标准Hikari配置
         */
        fun mySetting2Config(baseSetting: BaseMyHikariSetting): HikariConfig {
            val hikariConfig = HikariConfig()
            hikariConfig.driverClassName = baseSetting.driverClassName
            hikariConfig.jdbcUrl = baseSetting.jdbcUrl
            hikariConfig.username = baseSetting.username
            hikariConfig.password = baseSetting.password
            hikariConfig.maximumPoolSize = baseSetting.maximumPoolSize!!
            hikariConfig.maxLifetime = baseSetting.maxLifetime!!
            hikariConfig.idleTimeout = baseSetting.idleTimeout!!
            hikariConfig.dataSourceProperties = baseSetting.dataSourceProperties
            return hikariConfig
        }
    }
}
```

- 位于项目`resources/datasources`目录下的`datasources.yml`文件:

```yml
spring:
  datasources:
    #    主数据源(pg)
    master:
      hikari:
        driver-class-name: org.postgresql.Driver
        jdbc-url: jdbc:postgresql://127.0.0.1/xxx
        username: postgres
        password: testpostgres
        maximum-pool-size: 20 
        max-lifetime: 30000
        idle-timeout: 30000
        data-source-properties:
          prepStmtCacheSize: 250
          prepStmtCacheSqlLimit: 2048
          cachePrepStmts: true
          useServerPrepStmts: true
    #    access数据源
    first:
      hikari:
        driver-class-name: net.ucanaccess.jdbc.UcanaccessDriver
        jdbc-url: jdbc:ucanaccess:////xxx/xxx/xxx.mdb
        username:
        password:
        maximum-pool-size: 20
        max-lifetime: 30000
        idle-timeout: 30000
        data-source-properties:
          prepStmtCacheSize: 250
          prepStmtCacheSqlLimit: 2048
          cachePrepStmts: true
          useServerPrepStmts: true
    second:
      hikari:
        driver-class-name: org.postgresql.Driver
        jdbc-url: jdbc:postgresql://127.0.0.1:5432/xxx
        username: postgres
        password: postgres
        maximum-pool-size: 20
        max-lifetime: 30000
        idle-timeout: 30000
        data-source-properties:
          prepStmtCacheSize: 250
          prepStmtCacheSqlLimit: 2048
          cachePrepStmts: true
          useServerPrepStmts: true
```

## Tip:

如果在一个项目中mybatis和spring data jpa同时开启了多数据源,在Spring的事务注解中需指定当前事务管理bean

```java
@Transactional(rollbackFor = { Exception.class, Xxx.class },transactionManager = "masterTransactionManager")
```
