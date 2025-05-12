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
 * @File Title    : ���� �߱�/����>�����ŷ������������>Ŀ����>PDF���� ����
 * @Description   : ���� �߱�/����>�����ŷ������������>Ŀ����>PDF���� ����
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

	//��������
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

    //PDF���� ���ø� ���� ���μ���
    String sFileRepositoryRoot  = ServerInfo.getRepositoryRoot();           //��Ʈ ���
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

        //���� ������ ��ȸ ���μ���
        JexData rslt = getData( util, pageNo, userInfo);

        if("0".equals(rslt.getString("TOT_CCNT"))){
            result.put("TOT_CCNT",rslt.getString("TOT_CCNT"));
            if( filePdfPath.isFile() ){
                filePdfPath.delete();
            }

            break;
        }
        else{
            //PDF ������ SET ���μ���
            createPdf(doc, rslt, userInfo, input.getString("INQ_YM"));

            //��ȸ �Ⱓ���� �����Ͱ� ��� �����ϸ� ����ȸ ���μ���
            isNext = "Y".equals(rslt.getString("NEXT_PAGE_EXIS_YN"));
            pageNo++;
        }
    }

    if (doc != null)
        doc.close();

    String pathText = "";

    //�����Ͱ� �����ϴ� ��츸 ���� ���� ó��
    if( !"0".equals(result.getString("TOT_CCNT")) ){
        //NAS ����� PDF���� �̵�ó��
        File nasFilePath = nasFileMove(log, filePdfPath);
        pathText = String.valueOf(nasFilePath);
    }

    result.put("ATFL_PATH_NM", pathText);
    result.put("TOT_CCNT", StringUtil.null2void(input.getString("TOT_CCNT"), "0"));

    if (tFileOs != null)
    	tFileOs.close();

    util.setResult(result);
%>

<%!//NAS ����ҷ� ���� �̵�
    private File nasFileMove( JexLogger log, File file ) throws Exception {

        String currentDateTime = DateTime.getInstance().getDate("yyyymmddhh24miss");

        String NAS_CERT_ROOT = ServerInfo.getNasRepository("oba", true, true);  //NAS ���� ���� ��Ʈ ���

        String PDF_PATH = NAS_CERT_ROOT + File.separator + "File_"+file.lastModified()+"_1.pdf"; //������ NAS pdf ���� ��� ����

        FileInputStream fis  = null;
        FileOutputStream fos = null;
        int BLOCK_SIZE = 8192; // 8K

        try {

            byte[] buffer = new byte[BLOCK_SIZE];

            // NAS ��η� PDF ������ ����
            fis = new FileInputStream( file );
            fos = new FileOutputStream(new File(PDF_PATH));
            int read = 0;
            while((read = fis.read(buffer, 0, BLOCK_SIZE)) != -1) {
                fos.write(buffer, 0, read);
            }
            closeStreams(fis, fos);

        } catch(Exception e) {
            log.error(e);
            throw new JexWebBIZException("CUS0001","PDF��ȯ");
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

    //PDF ���ø� ����
    private void createPdf(Document doc, JexData data, JexData userInfo, String inqYm ) throws Exception {

        String pdfImgRoot = getServletContext().getRealPath("/WEB-INF/sw/clipreport5/img/");
        String imgSrc = pdfImgRoot+"logo-sbi.png";
        Image img = Image.getInstance(imgSrc);
        img.setAlignment(Image.RIGHT);
        img.scalePercent(55f);
        doc.add( img );
        doc.add( getBlink(10) );

        //�������
        doc.add( getTitle() );
        //����
        doc.add( getBlink(10) );
        //������
        doc.add( getTerm(userInfo) );
        //����
        doc.add( getBlink(10) );
        //��ȸ�Ⱓ
        doc.add( getTerm2(inqYm) );
        //����
        doc.add( getBlink(5) );
        //��������
        doc.add( createTable(doc, data.getRecord("REC")) );
        //����
        doc.add( getBlink(10) );
        //�ٴڱ�
        doc.add( createButtomTable() );

    }

    //���� ������ ��ȸ ���μ���
    private JexData getData(WebCommonUtil util, int pageNo, JexData userInfo) throws Exception {

        JexData input = util.getInputDomain();

        // IMO Connection
        JexConnection imoCon = JexConnectionManager.createIMOConnection();

        JexData imoIn1 = util.createIMOData("DPM79322");

        imoIn1.put("CUST_NO"     ,userInfo.getString("CUST_NO"));
        imoIn1.put("INQ_YM"    , StringUtil.null2void(input.getString("INQ_YM"), ""));  //��ȸ��������
        imoIn1.put("PAGE_NO"    , 1);
        imoIn1.put("PAGE_PER_CCNT", StringUtil.null2void(input.getString("TOT_CCNT"), "0"));

        JexData imoOut1 =  imoCon.execute(imoIn1);

        // ������ ���� ����
        if (DomainUtil.isError(imoOut1)) {
            if (util.getLogger().isDebug()) {
                util.getLogger().debug("Error Code   ::"+DomainUtil.getErrorCode(imoOut1));
                util.getLogger().debug("Error Message::"+DomainUtil.getErrorMessage(imoOut1));
            }
            throw new JexWebBIZException(imoOut1);
        }

        return imoOut1;
    }

    //PDF ���� ����
    private Paragraph getTitle() throws DocumentException, IOException {

        Font font = FontFactory.getFont("PretendardB", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(30);
        font.setColor(new Color(0,134,255));
        Paragraph title = new Paragraph("���¹�ŷ�����ŷ����� ������� �ȳ�", font);
        return title;

    }

    //PDF ������ ����
    private Paragraph getTerm(JexData userInfo) throws DocumentException, IOException {

        Font font = FontFactory.getFont("PretendardB", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(18);
        Paragraph term = new Paragraph(userInfo.getString("CUST_NM") + " ������ �����ŷ����� ��������", font);

        return term;
    }

    //PDF ������ ����
    private Paragraph getTerm2(String sDate) throws DocumentException, IOException {
        Font font = FontFactory.getFont("PretendardR", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(13);
        font.setColor(new Color(105, 110, 119));
        Paragraph term = new Paragraph("��ȸ�Ⱓ : " + FormatUtil.date(sDate, "."), font);
        term.setAlignment(Element.ALIGN_RIGHT);
        return term;
    }

    //PDF ���� ����
    private Paragraph getBlink(int size) throws DocumentException, IOException {

        Font font = FontFactory.getFont("PretendardR", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(size);
        Paragraph p = new Paragraph(" ", font);

        return p;
    }

    //PDF ���� ���̺� ����
    private PdfPTable createTable(Document doc, JexDataRecordList<JexData> rec) throws DocumentException {

        PdfPTable table = new PdfPTable(4);
        table.setTotalWidth(new float[] { 100, 120, 150, 170 });
        table.setLockedWidth(true);

        createTableHeader(table);
        createTableBody(doc, table, rec);

        return table;
    }

    //PDF ���� ���̺� ��� ���� ����
    private void createTableHeader(PdfPTable table) {

        Font font = FontFactory.getFont("���� ���", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setStyle(Font.BOLD);
        font.setSize(9);

        createCell(table, font, "��������", true);
        createCell(table, font, "���¹�ȣ", true);
        createCell(table, font, "�����޴���", true);
        createCell(table, font, "���Ǿ��", true);

        table.completeRow();
    }

    //PDF ���� ���̺� ���� ���� ����
    private void createTableBody(Document doc, PdfPTable table, JexDataRecordList<JexData> rec) {

        Font font = FontFactory.getFont("���� ���", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
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

    //PDF ���� ���̺� ���� �� �ɼ� ���� ����
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

    //PDF �ٴ� ���� ����
    private PdfPTable createButtomTable() throws DocumentException {

        PdfPTable table = new PdfPTable(1);
        table.setTotalWidth(new float[] { 540 });
        table.setLockedWidth(true);

        Font font = FontFactory.getFont("���� ���", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        font.setSize(9);

        String text = "�� ���������            : ���¹�ȣ, ī��ŷ�����, Ŀ�������������, �����ŷ�����, ��ݰ��ɱݾ�, �����ŷ�����(�ݸ� ��)\r\r";
        text += "�� ���⿹��/�������� : ���¹�ȣ, �����ŷ�����, �ܾ�, �����ŷ�����(�ݸ� ��)";

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

    // Stream�� Close�Ѵ�.
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