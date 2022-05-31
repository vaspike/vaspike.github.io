---
title: "分片上传"
date: 2022-05-31T20:59:22+08:00
draft: true
---
## 分片上传 Java

```java
/**
 * @author rxz
 * @since 2021/4/26 15:33
 */
@Api(tags = {"文件接口"})
@RestController
@RequestMapping("file")
public class FileController implements InitializingBean {
    // 文件保存路径
    @Value("${uploadFile.Path}")
    private String FILE_UPLOAD_PATH;//普通上传文件路径
    @Value("${uploadBigFile.Path}")
    private String BIG_FILE_UPLOAD_PATH;//分片上传文件保存路径
    private ConcurrentHashMap<String, Integer> map;//key:文件名 value:当前上传了几个分片
    private ConcurrentHashMap<String, Integer> chunkNum;//key:文件名 value:上传完共需多少个分片
//    private String filePath;
    @Value("${icon_watermark}")
    private String ICON_WATERMARK;//水印相对路径
    private byte[] iconBytes;//待初始化,水印logo字节数组

    @PostMapping("upload")
    @ResponseBody
    @ApiOperation("上传文件,调用后可使用resources/拼接返回值进行访问资源")
    public BasicRspRlt<String> upload(@RequestParam("file") @ApiParam(value = "上传的文件 MultipartFile格式", required = true) MultipartFile file,
                                      @ApiParam("文件名,此参为空时新上传文件不会覆盖旧文件") String filename,@ApiParam("是否需添加水印") Boolean markFlag) {
        if (file.isEmpty()) {
            throw new OfficialWebException(SystemError.FILE_PART_MISSS);
        }
        String fileName = file.getOriginalFilename();
        String suffixName = "";
        if (fileName != null) {
            suffixName = fileName.substring(fileName.lastIndexOf("."));
        }
        //生成文件名称通用方法
        String newFileName;//加水印前的文件名
        String newFileName1;//添加水印后文件名称
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
        Random r = new Random();
        if (filename == null) {
            newFileName = sdf.format(new Date()) + r.nextInt(100) + suffixName;
            newFileName1 = sdf.format(new Date()) + r.nextInt(100) + suffixName;
        } else {
            newFileName = sdf.format(new Date()) + r.nextInt(100);
            newFileName1 = fileName;
        }
        try {
            // 保存文件
            byte[] bytes = file.getBytes();
            Path path = Paths.get(FILE_UPLOAD_PATH + newFileName);
            Files.write(path, bytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (markFlag!=null&& markFlag){//如果要添加水印,则进入if
            if (iconBytes==null){
                myInit();
            }
            boolean flag = false;
                flag = ImageUtil.markImageByIcon(this.iconBytes, FILE_UPLOAD_PATH + newFileName, FILE_UPLOAD_PATH + newFileName1);
            if (!flag){
                throw new OfficialWebException(SystemError.ADD_WATERMARK_EXCEPTION);
            }else {
                boolean deleteFlag = new File(FILE_UPLOAD_PATH + newFileName).delete();
                if (!deleteFlag){
                    LoggerFactory.getLogger(getClass()).error("删除临时图片失败");
                }
            }
            return new BasicRspRlt<>(newFileName1);
        }
        return new BasicRspRlt<>(newFileName);
    }


    @PostMapping("chunkStart")
    @ApiOperation("分片上传文件前置接口")
    public BasicRspRlt<String> chunkStart(@RequestParam @ApiParam(value = "文件名", required = true) String fileName, @RequestParam @ApiParam(value = "文件分片数", required = true) Integer num) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
        String format = sdf.format(new Date());
        String filePath = format + fileName;
        if (this.chunkNum==null||this.map==null){
            this.map = new ConcurrentHashMap<>();
            this.chunkNum = new ConcurrentHashMap<>();
        }
        this.map.put(filePath, 1);
        this.chunkNum.put(filePath, num);
        return new BasicRspRlt<>(filePath);
    }

    @PostMapping("chunkUpload")
    @ApiOperation("分片上传文件接口")
    public BasicRspRlt<Integer> chunkUpload(@RequestParam @ApiParam(value = "文件", required = true) MultipartFile file, @RequestParam @ApiParam(value = "第几片(从1起始计数)", required = true) Integer chunk,
                                            @RequestParam @ApiParam(value = "chunkStart接口中返回的文件名", required = true) String filePath) {
        if (map != null) {
            try {
                byte[] bytes = file.getBytes();
                String tempName = BIG_FILE_UPLOAD_PATH + filePath + chunk + ".tmp";
                Path path = Paths.get(tempName);
                Files.write(path, bytes);
                Integer x = map.get(filePath);
                if (x < chunkNum.get(filePath)) {
                    map.put(filePath, x + 1);
                } else {
//                    map.remove(this.filePath);
                    FileOutputStream fileOutputStream = new FileOutputStream(BIG_FILE_UPLOAD_PATH + filePath);
                    byte[] buf = new byte[1024];
                    for (long i = 1; i <= chunkNum.get(filePath); i++) {
                        String chunkFile = filePath + i + ".tmp";
                        File file1 = new File(BIG_FILE_UPLOAD_PATH + chunkFile);
                        InputStream inputStream = new FileInputStream(file1);
                        int len;
                        while ((len = inputStream.read(buf)) != -1) {
                            fileOutputStream.write(buf, 0, len);
                        }
                        inputStream.close();
                        boolean delete = file1.delete();
                        if (!delete) {
                            throw new OfficialWebException(SystemError.FILE_DELETE_EXCEPTION);
                        }
                    }
                    fileOutputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

        }else {
            throw new OfficialWebException(SystemError.UPLOADING_BEFORE_CHUNK_START);
        }
        return new BasicRspRlt<>(chunk);

    }

    @GetMapping("download")
    @ApiOperation("文件下载")
    public void download (@RequestParam String FileName, HttpServletResponse response) throws UnsupportedEncodingException {
        if (!FileName.equals("")){
            FileInputStream fs = null;
            BufferedInputStream bis = null;
            byte[] buffer = new byte[1024];
            String downloadFilePath = FILE_UPLOAD_PATH+FileName;
            File file = new File(downloadFilePath);
            if (!file.exists()){//如果要下载的文件在第一个文件目录找不到,将file路径改为另一个目录
                downloadFilePath = BIG_FILE_UPLOAD_PATH+FileName;
                file = new File(downloadFilePath);
                if (!file.exists()){
                    throw new RuntimeException("FILE_NOT_EXIST~");
                }
            }
            response.addHeader("Content-Disposition",
                    "attachment; filename="+URLEncoder.encode(FileName,"UTF-8"));
            byte[] bytes = null;//下面流的写法是网上的解决方案,这个下载接口仅仅为了解决浏览器端下载ppt等文件会默认打开的问题,因此此方法唯一重要的就是上一句设置响应头
            try {
                fs = new FileInputStream(file);
                bis = new BufferedInputStream(fs);
                ServletOutputStream os = response.getOutputStream();
                int i = bis.read(buffer);
                bytes = new byte[fs.available()];
                while (i != -1) {
                    os.write(buffer, 0, i);
                    i = bis.read(buffer);
                }
            } catch (IOException e) {
                throw new RuntimeException("您访问的文件刚刚被删除了~");
            }finally {
                if (fs!=null&&bis!=null) {
                    try {
                        fs.close();
                        bis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }else {
            throw new OfficialWebException(SystemError.MUST_PATAMATER_NOT_NULL);
        }
    }

    @GetMapping("clear_map_and_temp")
    @ApiOperation("清空上传中断生成的临时文件和哈希缓存")
    public BasicRsp mapAndTempClear(){
        if (map!=null&&chunkNum!=null){
            map.clear();
            chunkNum.clear();
        }
        final String patternName = ".*.tmp";
        File dirPath = new File(BIG_FILE_UPLOAD_PATH);
        String[] list = dirPath.list(new FilenameFilter() {
            private final Pattern pattern = Pattern.compile(patternName);
            @Override
            public boolean accept(File dir, String name) {
                return pattern.matcher(name).matches();
            }
        });
        assert list != null;
        for (String s : list) {
//            System.out.println(s);
            String tempFilePath = BIG_FILE_UPLOAD_PATH + s;
            boolean flag = new File(tempFilePath).delete();
        }
        return new BasicRsp();
    }

    public void myInit(){
        ClassPathResource pathResource = new ClassPathResource(ICON_WATERMARK);
        InputStream is =null;
        try {
            is = pathResource.getInputStream();
            this.iconBytes = ImageUtil.toByteArray(is);
        } catch (IOException e) {
            throw new OfficialWebException("4040","获取流失败");
        }finally {
            if (is!=null){
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        myInit();
    }
}

```

