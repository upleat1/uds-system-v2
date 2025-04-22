<%@page contentType="text/html;charset=EUC-KR" %>
<%@page import="jex.data.JexData"%>
<%@page import="jex.data.JexDataList"%>
<%@page import="jex.data.annotation.JexDataInfo"%>
<%@page import="jex.enums.JexDataType"%>
<%@page import="jex.log.JexLogFactory"%>
<%@page import="jex.log.JexLogger"%>
<%@page import="jex.web.util.WebCommonUtil"%>
<%@page import="jex.resource.cci.JexConnection"%>
<%@page import="jex.resource.cci.JexConnectionManager"%>
<%@page import="jex.util.DomainUtil"%>
<%@page import="jex.web.exception.JexWebBIZException"%>
<%@page import="jex.sys.JexSystemConfig"%>
<%@page import="java.net.URL"%>
<%@page import="com.lowagie.text.Image"%>
<%@page import="com.lowagie.text.Rectangle"%>
<%@page import="com.clipeform42bc154.lowagie.text.Element"%>
<%@page import="com.clipsoft.clipreport.paint.text.old.TextAlignment"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="jex.web.data.JexDataDownloadFile"%>
<%@page import="com.sbisb.uic.util.FormatUtil"%>
<%@page import="jex.util.code.CodeManager"%>
<%@page import="jex.util.code.CodeUtil"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.awt.Color"%>
<%@page import="com.lowagie.text.Phrase"%>
<%@page import="com.lowagie.text.pdf.PdfPCell"%>
<%@page import="com.lowagie.text.pdf.PdfPTable"%>
<%@page import="jex.util.StringUtil"%>
<%@page import="java.io.OutputStream"%>
<%@page import="com.lowagie.text.pdf.BaseFont"%>
<%@page import="com.lowagie.text.FontFactory"%>
<%@page import="com.lowagie.text.Font"%>
<%@page import="java.io.IOException"%>
<%@page import="com.lowagie.text.DocumentException"%>
<%@page import="com.lowagie.text.Paragraph"%>
<%@page import="com.lowagie.text.Document"%>
<%@page import="com.lowagie.text.pdf.PdfWriter"%>
<%@page import="com.lowagie.text.pdf.PdfDocument"%>
<%@page import="java.io.Closeable"%>
<%@page import="java.io.File"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="jex.util.io.FileInputStream"%>
<%@page import="jex.util.date.DateTime"%>
<%@page import="com.sbisb.uic.core.ServerInfo"%>
<%@page import="jex.data.impl.JexDataRecordList"%>
<%@page import="jex.util.JexUtil"%>
<%@page import="com.sbisb.uic.session.SessionManager"%>
<%
/**
 * <pre>
 * @Project ID    : UMA
 * @Service ID    : doc0160500A02
 * @File path     : doc/doc0160500A02_act.jsp
 * @File Title    : 증명서 발급/제출>금융거래정보제공사실>커플장>PDF파일 생성
 * @Description   : 증명서 발급/제출>금융거래정보제공사실>커플장>PDF파일 생성
 * @Author        : 951845
 * @Register Date : 20230901173410
 * </pre>
 **/
%>
<%
	WebCommonUtil util = WebCommonUtil.getInstace(request, response);
	JexLogger log  = util.getLogger();

	@JexDataInfo(id="doc0160500A02", type=JexDataType.WSVC)
	JexData input  = util.getInputDomain();
	JexData result = util.createResultDomain();

	//세션정보
    JexData userInfo = SessionManager.getUserInfo(session);

    if(JexUtil.isNull(userInfo) ){
        throw new JexWebBIZException("CMM0044");
    }

    String repositoryRoot = getServletContext().getRealPath("/WEB-INF/sw/clipreport5/font");
    FontFactory.register(repositoryRoot+"/Pretendard-Regular.ttf" , "PretendardR");
    FontFactory.register(repositoryRoot+"/Pretendard-Bold.ttf", "PretendardB");
    FontFactory.register(repositoryRoot+"/SpoqaHanSansNeo-Regular.ttf", "SpoqaR");
    FontFactory.register(repositoryRoot+"/SpoqaHanSansNeo-Bold.ttf", "SpoqaB");

    Document doc = new Document();
    doc.setMargins(25F, 25F, 20F, 25F);

    //PDF생성 템플릿 저장 프로세스
    String sFileRepositoryRoot  = ServerInfo.getRepositoryRoot();           //루트 경로
    String sFileYear            = DateTime.getInstance().getDate("YYYY");
    String sFileMonth           = DateTime.getInstance().getDate("MM");

    String sFileBizPath         = "msb" + File.separator + "oba" + File.separator + sFileYear + File.separator + sFileMonth;
    String sFileFullPath        = sFileRepositoryRoot + sFileBizPath;
    String currentDateTime = DateTime.getInstance().getDate("yyyymmddhh24miss");

    File sDirFile = new File(sFileFullPath);

    if(sDirFile.exists() == false) {
        sDirFile.mkdirs();
    }

    String fileName = "File_" + sDirFile.lastModified() + "_1.pdf";
    File pdfFile = new File(sFileFullPath + File.separator + fileName);

    OutputStream tFileOs = new FileOutputStream(pdfFile);
    PdfWriter.getInstance(doc, tFileOs);

    File filePdfPath = pdfFile;

    int pageNo     = 1;
    boolean isNext = true;

    doc.open();

    while (isNext) {
        doc.newPage();

        //전문 데이터 조회 프로세스
        JexData rslt = getData( util, pageNo, userInfo);

        if("0".equals(rslt.getString("TOT_CCNT"))){
            result.put("TOT_CCNT",rslt.getString("TOT_CCNT"));
            if( filePdfPath.isFile() ){
                filePdfPath.delete();
            }

            break;
        }
        else{
            //PDF 데이터 SET 프로세스
            createPdf(doc, rslt, userInfo, input.getString("INQ_YM"));

            //조회 기간내에 데이터가 계속 존재하면 재조회 프로세스
            isNext = "Y".equals(rslt.getString("NEXT_PAGE_EXIS_YN"));
            pageNo++;
        }
    }

    if (doc != null)
        doc.close();

    String pathText = "";

    //데이터가 존재하는 경우만 파일 전송 처리
    if( !"0".equals(result.getString("TOT_CCNT")) ){
        //NAS 저장소 PDF파일 이동처리
        File nasFilePath = nasFileMove(log, filePdfPath);
        pathText = String.valueOf(nasFilePath);
    }

    result.put("ATFL_PATH_NM", pathText);
    result.put("TOT_CCNT", StringUtil.null2void(input.getString("TOT_CCNT"), "0"));

    if (tFileOs != null)
    	tFileOs.close();

    util.setResult(result);
%>

<%!//NAS 저장소로 파일 이동
    private File nasFileMove( JexLogger log, File file ) throws Exception {

        String currentDateTime = DateTime.getInstance().getDate("yyyymmddhh24miss");

        String NAS_CERT_ROOT = ServerInfo.getNasRepository("oba", true, true);  //NAS 증명서 생성 루트 경로

        String PDF_PATH = NAS_CERT_ROOT + File.separator + "File_"+file.lastModified()+"_1.pdf"; //생성될 NAS pdf 파일 경로 설정

        FileInputStream fis  = null;
        FileOutputStream fos = null;
        int BLOCK_SIZE = 8192; // 8K

        try {

            byte[] buffer = new byte[BLOCK_SIZE];

            // NAS 경로로 PDF 파일을 복사
            fis = new FileInputStream( file );
            fos = new FileOutputStream(new File(PDF_PATH));
            int read = 0;
            while((read = fis.read(buffer, 0, BLOCK_SIZE)) != -1) {
                fos.write(buffer, 0, read);
            }
            closeStreams(fis, fos);

        } catch(Exception e) {
            log.error(e);
            throw new JexWebBIZException("CUS0001","PDF변환");
        } finally {
            if(fos != null) {
                try {
                    fos.close();
                } catch(Exception ignore) {
                    log.error(ignore);
                }
            }
            if(fis != null) {
                try {
                    fis.close();
                } catch(Exception ignore) {
                    log.error(ignore);
                }
            }
        }

        if( file.isFile() ){
            file.delete();
        }
        return new File(PDF_PATH);
    }

    //PDF 템플릿 생성
    private void createPdf(Document doc, JexData data, JexData userInfo, String inqYm ) throws Exception {

        String pdfImgRoot = getServletContext().getRealPath("/WEB-INF/sw/clipreport5/img/");
        String imgSrc = pdfImgRoot+"logo-sbi.png";
        Image img = Image.getInstance(imgSrc);
        img.setAlignment(Image.RIGHT);
        img.scalePercent(55f);
        doc.add( img );
        doc.add( getBlink(10) );

        //제목생성
        doc.add( getTitle() );
        //여백
        doc.add( getBlink(10) );
        //부제목
        doc.add( getTerm(userInfo) );
        //여백
        doc.add( getBlink(10) );
        //조회기간
        doc.add( getTerm2(inqYm) );
        //여백
        doc.add( getBlink(5) );
        //본문내용
        doc.add( createTable(doc, data.getRecord("REC")) );
        //여백
        doc.add( getBlink(10) );
        //바닥글
        doc.add( createButtomTable() );

    }

    //전문 데이터 조회 프로세스
    private JexData getData(WebCommonUtil util, int pageNo, JexData userInfo) throws Exception {

        JexData input = util.getInputDomain();

        // IMO Connection
        JexConnection imoCon = JexConnectionManager.createIMOConnection();

        JexData imoIn1 = util.createIMOData("DPM79322");

        imoIn1.put("CUST_NO"     ,userInfo.getString("CUST_NO"));
        imoIn1.put("INQ_YM"    , StringUtil.null2void(input.getString("INQ_YM"), ""));  //조회시작일자
        imoIn1.put("PAGE_NO"    , 1);
        imoIn1.put("PAGE_PER_CCNT", StringUtil.null2void(input.getString("TOT_CCNT"), "0"));

        JexData imoOut1 =  imoCon.execute(imoIn1);

        // 도메인 에러 검증
        if (DomainUtil.isError(imoOut1)) {
            if (util.getLogger().isDebug()) {
                util.getLogger().debug("Error Code   ::"+DomainUtil.getErrorCode(imoOut1));
                util.getLogger().debug("Error Message::"+DomainUtil.getErrorMessage(imoOut1));
            }
            throw new JexWebBIZException(imoOut1);
        }

        return imoOut1;
    }

    //PDF 제목 생성
    private Paragraph getTitle() throws DocumentException, IOException {

        Font font = FontFactory.getFont("PretendardB", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(30);
        font.setColor(new Color(0,134,255));
        Paragraph title = new Paragraph("오픈뱅킹금융거래정보 제공사실 안내", font);
        return title;

    }

    //PDF 부제목 생성
    private Paragraph getTerm(JexData userInfo) throws DocumentException, IOException {

        Font font = FontFactory.getFont("PretendardB", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(18);
        Paragraph term = new Paragraph(userInfo.getString("CUST_NM") + " 고객님의 금융거래정보 제공내역", font);

        return term;
    }

    //PDF 부제목 생성
    private Paragraph getTerm2(String sDate) throws DocumentException, IOException {
        Font font = FontFactory.getFont("PretendardR", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(13);
        font.setColor(new Color(105, 110, 119));
        Paragraph term = new Paragraph("조회기간 : " + FormatUtil.date(sDate, "."), font);
        term.setAlignment(Element.ALIGN_RIGHT);
        return term;
    }

    //PDF 여백 생성
    private Paragraph getBlink(int size) throws DocumentException, IOException {

        Font font = FontFactory.getFont("PretendardR", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(size);
        Paragraph p = new Paragraph(" ", font);

        return p;
    }

    //PDF 본문 테이블 생성
    private PdfPTable createTable(Document doc, JexDataRecordList<JexData> rec) throws DocumentException {

        PdfPTable table = new PdfPTable(4);
        table.setTotalWidth(new float[] { 100, 120, 150, 170 });
        table.setLockedWidth(true);

        createTableHeader(table);
        createTableBody(doc, table, rec);

        return table;
    }

    //PDF 본문 테이블 헤더 영역 생성
    private void createTableHeader(PdfPTable table) {

        Font font = FontFactory.getFont("나눔 고딕", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setStyle(Font.BOLD);
        font.setSize(9);

        createCell(table, font, "제공일자", true);
        createCell(table, font, "계좌번호", true);
        createCell(table, font, "제공받는자", true);
        createCell(table, font, "동의약관", true);

        table.completeRow();
    }

    //PDF 본문 테이블 본문 영역 생성
    private void createTableBody(Document doc, PdfPTable table, JexDataRecordList<JexData> rec) {

        Font font = FontFactory.getFont("나눔 고딕", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(8.5f);

        if (rec != null) {

            rec.isBeforeFirst();
            JexData recRow = null;
            while (rec.next()) {
                recRow = rec.get();

                createCell(table, font, FormatUtil.date(recRow.getString("TRN_DT"), "."), false);
                createCell(table, font, FormatUtil.maskName(recRow.getString("CUST_NM")), false);
                createCell(table, font, recRow.getString("PROD_NM"), false);
                createCell(table, font, FormatUtil.acno(recRow.getString("ACNO"), FormatUtil.Masking.NONE)    , false);

                table.completeRow();
            }
        }
    }

    //PDF 본문 테이블 본문 셀 옵션 영역 생성
    private void createCell(PdfPTable table, Font font, String headerStr, boolean isHeader) {

        PdfPCell cell = new PdfPCell(new Phrase(headerStr, font));
        cell.setFixedHeight(30);

        if (isHeader) {
            cell.setBackgroundColor(new Color(242, 242, 242));

            cell.setBorder(Rectangle.TOP);
            cell.setUseBorderPadding(true);

            cell.setBorderWidthLeft(0.4f);
            cell.setBorderWidthRight(0.4f);
            cell.setBorderColorLeft(new Color(229, 229, 229));
            cell.setBorderColorRight(new Color(229, 229, 229));

            cell.setBorderColorTop(new Color(0, 0, 0));
            cell.setBorderWidthTop(1f);

        } else {
            cell.setBorderColor(new Color(229, 229, 229));
        }

        cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
        cell.setVerticalAlignment(PdfPCell.ALIGN_MIDDLE);
        cell.setTop(0);
        cell.setPaddingTop(0);
        table.addCell(cell);

    }

    //PDF 바닥 영역 생성
    private PdfPTable createButtomTable() throws DocumentException {

        PdfPTable table = new PdfPTable(1);
        table.setTotalWidth(new float[] { 540 });
        table.setLockedWidth(true);

        Font font = FontFactory.getFont("나눔 고딕", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(9);

        String text = "· 입출금통장            : 계좌번호, 카드거래정보, 커플통장통계정보, 금융거래내역, 출금가능금액, 금융거래조건(금리 등)\r\r";
        text += "· 정기예금/자유적금 : 계좌번호, 금융거래내역, 잔액, 금융거래조건(금리 등)";

        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setFixedHeight(36);

        Color customColor = new Color(255, 255, 255);
        cell.setBackgroundColor(customColor);
        cell.setBorderColor(customColor);
        cell.setPaddingTop(2);
        cell.setPaddingBottom(2);
        cell.setVerticalAlignment(PdfPCell.ALIGN_MIDDLE);
        cell.setBorderWidth(0.0f);
        table.addCell(cell);
        table.completeRow();

        return table;
    }

    // Stream을 Close한다.
    public void closeStreams(Closeable... closeables) {
        for (Closeable closeable : closeables) {
            if (closeable != null) {
                try {
                    closeable.close();
                } catch (Exception ignore) {
                }
            }
        }
    }
%>