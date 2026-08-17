import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, PageBreak
)
from reportlab.pdfgen import canvas

class AltaCVNumberedCanvas(canvas.Canvas):
    """Exact AltaCV LaTeX page numbering: Centered 1, 2"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Times-Roman", 9.5)
        self.setFillColor(colors.HexColor("#111827"))
        text = f"{self._pageNumber}"
        self.drawCentredString(A4[0] / 2.0, 22, text)
        self.restoreState()

def generate_exact_altacv_pdf(output_path="Mikhail_Emad_Resume_2026.pdf"):
    # Precise AltaCV A4 Margins for exactly 2 balanced pages
    margin_x = 36
    margin_top = 26
    margin_bottom = 28
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=margin_x,
        rightMargin=margin_x,
        topMargin=margin_top,
        bottomMargin=margin_bottom
    )

    # Exact AltaCV LaTeX Color Tokens
    PRIMARY_COLOR = colors.HexColor("#111827")   # Deep Charcoal
    ACCENT_TEAL = colors.HexColor("#245366")     # Signature AltaCV Slate Teal
    BODY_COLOR = colors.HexColor("#1f2937")      # Classic Dark Slate
    MUTED_COLOR = colors.HexColor("#4b5563")     # Medium Slate
    LINK_BLUE = colors.HexColor("#1d4ed8")       # LaTeX URL Blue
    RULE_COLOR = colors.HexColor("#245366")      # Section Separator Line

    styles = getSampleStyleSheet()

    # Exact LaTeX Serif Typography Styles
    title_name_style = ParagraphStyle(
        'AltaTitleName',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=23,
        leading=26,
        textColor=PRIMARY_COLOR,
        alignment=0
    )

    tagline_style = ParagraphStyle(
        'AltaTagline',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11,
        leading=14,
        textColor=ACCENT_TEAL,
        alignment=0
    )

    contact_info_style = ParagraphStyle(
        'AltaContactInfo',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.2,
        leading=12.5,
        textColor=PRIMARY_COLOR,
        alignment=0
    )

    links_line_style = ParagraphStyle(
        'AltaLinksLine',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.2,
        leading=12.5,
        textColor=LINK_BLUE,
        alignment=0
    )

    section_heading_style = ParagraphStyle(
        'AltaSectionHeading',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11.5,
        leading=14.5,
        textColor=ACCENT_TEAL,
        spaceBefore=5,
        spaceAfter=1
    )

    body_text_style = ParagraphStyle(
        'AltaBodyText',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.8,
        leading=11.8,
        textColor=BODY_COLOR,
        alignment=4 # Justified
    )

    comp_bullet_style = ParagraphStyle(
        'AltaCompBullet',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.6,
        leading=11.4,
        textColor=BODY_COLOR,
        leftIndent=11,
        firstLineIndent=-11,
        spaceAfter=1.2
    )

    job_title_left = ParagraphStyle(
        'AltaJobLeft',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=9.2,
        leading=12,
        textColor=PRIMARY_COLOR
    )

    job_date_right = ParagraphStyle(
        'AltaJobRight',
        parent=styles['Normal'],
        fontName='Times-Italic',
        fontSize=8.8,
        leading=12,
        textColor=PRIMARY_COLOR,
        alignment=2 # Right aligned
    )

    job_sub_style = ParagraphStyle(
        'AltaJobSub',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.8,
        leading=11.5,
        textColor=MUTED_COLOR,
        spaceAfter=2
    )

    dash_bullet_style = ParagraphStyle(
        'AltaDashBullet',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.6,
        leading=11.4,
        textColor=BODY_COLOR,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=1.4
    )

    project_bullet_style = ParagraphStyle(
        'AltaProjectBullet',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.8,
        leading=12,
        textColor=BODY_COLOR,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3.5
    )

    story = []

    # =========================================================================
    # PAGE 1 - Exact AltaCV Header, Summary, Competencies, Professional Exp
    # =========================================================================

    # 1. Main Header
    story.append(Paragraph("Mikhail Emad Alber", title_name_style))
    story.append(Spacer(1, 1.5))
    story.append(Paragraph("AI Engineer &mdash; Full Stack Developer &mdash; Server Support", tagline_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("* New Cairo, Egypt &nbsp;&nbsp;&nbsp; * (+20) 128 998 1076 &nbsp;&nbsp;&nbsp; * Mikhailemad999@gmail.com", contact_info_style))
    story.append(Spacer(1, 1.5))
    story.append(Paragraph('<font color="#1d4ed8"><u><a href="https://www.linkedin.com/in/mikhail-emad-b67805372">LinkedIn</a></u></font> &nbsp;&nbsp;&nbsp;&nbsp; <font color="#1d4ed8"><u><a href="https://github.com/mikhailemad999">GitHub</a></u></font>', links_line_style))
    story.append(Spacer(1, 2))
    story.append(HRFlowable(width="100%", thickness=0.8, color=RULE_COLOR, spaceAfter=5, spaceBefore=1))

    # 2. Professional Summary
    story.append(Paragraph("Professional Summary", section_heading_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE_COLOR, spaceAfter=3, spaceBefore=1))
    
    summary_text = (
        "Results-driven <b>AI Engineer and Full Stack Developer</b> with <b>2+ years of experience</b> designing, building, and deploying "
        "<b>30+ production-grade applications</b> across ERP systems, e-commerce platforms, healthcare solutions, and trading systems. "
        "Certified from the intensive <b>243-Hour AI & Data Science Diploma</b> and <b>Full Stack React Python Diploma at AMIT Learning</b>. "
        "Currently managing enterprise web hosting stacks (<b>cPanel, SiteGround, Ubuntu Linux Servers</b>), DNS/SSL routing, and Tier-1/2 support at <b>Petra Software</b>. "
        "Proven expertise in scalable backend architecture using <b>Django REST Framework</b>, RESTful API design, database query optimization (<b>40% faster</b>), and <b>React / TypeScript</b>."
    )
    story.append(Paragraph(summary_text, body_text_style))
    story.append(Spacer(1, 2))

    # 3. Core Competencies
    story.append(Paragraph("Core Competencies", section_heading_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE_COLOR, spaceAfter=3, spaceBefore=1))

    competencies = [
        ("Backend", "Python, Django, Django REST Framework, RESTful APIs, JWT Authentication, OAuth2, Microservices Concepts, Celery, Redis, Task Queues"),
        ("Frontend", "React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Bootstrap, Responsive Design, Redux Toolkit, Context API, Axios"),
        ("Databases", "PostgreSQL, MySQL, Microsoft SQL Server, MongoDB, Database Schema Design, Query Optimization, pgAdmin"),
        ("AI & ML", "PyTorch, TensorFlow, Keras, CNNs, RNNs, Transformers, GANs, Scikit-Learn, Predictive Analytics, EDA with Pandas/NumPy, Plotly & Dash"),
        ("Server & Cloud Ops", "Ubuntu Linux Server (22.04 LTS), cPanel & SiteGround Hosting, Nginx Reverse Proxy, Apache, DNS Zone Routing, SSL/TLS, SSH Security, Linux Bash"),
        ("DevOps & Tools", "Git, GitHub, CI/CD Fundamentals, Linux CLI, Agile/Scrum, pgAdmin, REST API Testing, Postman"),
        ("Architecture", "Clean Architecture, MVC/MVT Patterns, Scalable System Design, Role-Based Access Control (RBAC)"),
        ("Soft Skills", "Problem-Solving, Team Leadership, Technical Documentation, Cross-functional Communication, System Diagnostics")
    ]

    for cat_name, cat_skills in competencies:
        story.append(Paragraph(f"• <b>{cat_name}:</b> {cat_skills}", comp_bullet_style))

    story.append(Spacer(1, 2))

    # 4. Professional Experience
    story.append(Paragraph("Professional Experience", section_heading_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE_COLOR, spaceAfter=4, spaceBefore=1))

    # Experience 1: Petra Software
    petra_row = Table([
        [
            Paragraph("• <b>Junior IT Support Technician & Server Administrator</b>", job_title_left),
            Paragraph("2025 &mdash; Present", job_date_right)
        ]
    ], colWidths=[370, 153])
    petra_row.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(petra_row)
    story.append(Paragraph("&nbsp;&nbsp;Petra Software &mdash; Assiut, Egypt", job_sub_style))
    story.append(Paragraph("&ndash; Provided Tier-1 and Tier-2 technical support for enterprise software and network systems used by <b>50+ employees</b>.", dash_bullet_style))
    story.append(Paragraph("&ndash; Administered web hosting environments on <b>cPanel</b>, <b>SiteGround</b>, and <b>Ubuntu Linux Servers</b>, sustaining 99.9% uptime.", dash_bullet_style))
    story.append(Paragraph("&ndash; Automated SSL certificate renewals, configured DNS zone files (A, CNAME, MX, TXT), and enforced secure SSH permissions.", dash_bullet_style))
    story.append(Paragraph("&ndash; Collaborated with developers to reproduce, document, and isolate server bottlenecks, accelerating patch deployment cycles.", dash_bullet_style))
    story.append(Spacer(1, 2.5))

    # Experience 2: Machine Learning Specialist (AMIT Learning)
    ml_row = Table([
        [
            Paragraph("• <b>Machine Learning & Deep Learning Specialist (AI Diploma)</b>", job_title_left),
            Paragraph("2025 &mdash; 2026", job_date_right)
        ]
    ], colWidths=[370, 153])
    ml_row.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(ml_row)
    story.append(Paragraph("&nbsp;&nbsp;AMIT Learning (Licensed by MCIT & ITIDA) &mdash; 243 Training Hours", job_sub_style))
    story.append(Paragraph("&ndash; Completed <b>243 training hours</b> with <b>70+ hands-on labs</b> and <b>2 mega capstone projects</b> in AI and machine learning.", dash_bullet_style))
    story.append(Paragraph("&ndash; Built, trained, and optimized CNNs, RNNs, and Transformers using <b>PyTorch</b> and <b>TensorFlow/Keras</b> for computer vision and NLP.", dash_bullet_style))
    story.append(Paragraph("&ndash; Engineered data processing pipelines, exploratory data analysis with Pandas/NumPy, and interactive Dash/Plotly analytical apps.", dash_bullet_style))
    story.append(Spacer(1, 2.5))

    # Experience 3: Full Stack Developer (Freelance)
    freelance_row = Table([
        [
            Paragraph("• <b>Full Stack Developer</b>", job_title_left),
            Paragraph("2024 &mdash; Present", job_date_right)
        ]
    ], colWidths=[370, 153])
    freelance_row.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(freelance_row)
    story.append(Paragraph("&nbsp;&nbsp;Freelance / Independent", job_sub_style))
    story.append(Paragraph("&ndash; Architected and deployed <b>30+ production-grade applications</b> including ERP systems, trading platforms, healthcare diagnostics tools, and e-commerce solutions.", dash_bullet_style))
    story.append(Paragraph("&ndash; Designed and implemented scalable <b>RESTful APIs</b> using Django REST Framework, reducing average API response time by <b>30%</b> through query optimization and caching strategies.", dash_bullet_style))
    story.append(Paragraph("&ndash; Engineered secure authentication systems using <b>JWT</b> and <b>Role-Based Access Control (RBAC)</b>, protecting data across multi-tenant applications.", dash_bullet_style))
    story.append(Paragraph("&ndash; Optimized relational database performance across <b>PostgreSQL, MySQL, and SQL Server</b>; improved query execution speed by up to <b>40%</b> through indexing and schema redesign.", dash_bullet_style))
    story.append(Paragraph("&ndash; Built dynamic, responsive UIs with <b>React and TypeScript</b>, improving cross-browser compatibility and user engagement.", dash_bullet_style))
    story.append(Paragraph("&ndash; Integrated <b>machine learning models</b> into production systems for predictive analytics, churn prediction, and medical diagnostics.", dash_bullet_style))

    # =========================================================================
    # PAGE BREAK -> PAGE 2
    # =========================================================================
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2 - Key Projects, Education, Certifications, Languages, Personal Info
    # =========================================================================

    # 5. Key Projects
    story.append(Paragraph("Key Projects", section_heading_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE_COLOR, spaceAfter=5, spaceBefore=1))

    projects = [
        ("Trade Spark Hub 14", "Scalable multi-module business platform with inventory management, sales tracking, and financial dashboards. Built with Django and React using clean architecture principles."),
        ("MedAI-Hub", "AI-powered healthcare platform integrating diagnostic ML models with patient data management; delivers real-time analysis via RESTful APIs, reducing diagnostic processing time significantly."),
        ("Insightful Churn Predictor", "Machine learning solution using classification algorithms for customer retention analysis; achieved <b>85%+ prediction accuracy</b>, enabling proactive retention strategies."),
        ("Enterprise ERP System", "Modular platform managing HR, procurement, inventory, and accounting for large-scale operations; built on Django with PostgreSQL and RBAC."),
        ("ServerOps & Hosting Suite", "Infrastructure automation toolkit for Ubuntu Linux, cPanel, and SiteGround managing DNS zones, SSL certificates, and daemon health."),
        ("E-commerce Platforms", "Multiple secure e-commerce solutions with payment gateway integration, order management, admin dashboards, and JWT-secured APIs with React frontends.")
    ]

    for p_name, p_desc in projects:
        story.append(Paragraph(f"• <b>{p_name}</b> &mdash; {p_desc}", project_bullet_style))

    story.append(Spacer(1, 4))

    # 6. Education
    story.append(Paragraph("Education", section_heading_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE_COLOR, spaceAfter=4, spaceBefore=1))

    edu_row = Table([
        [
            Paragraph("<b>Bachelor of Science &mdash; Computer Science and Engineering</b>", job_title_left),
            Paragraph("<i>Expected 2025</i>", job_date_right)
        ]
    ], colWidths=[370, 153])
    edu_row.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(edu_row)
    story.append(Paragraph("The Egyptian E-Learning University &mdash; Assiut Branch", job_sub_style))
    story.append(Spacer(1, 4))

    # 7. Certifications
    story.append(Paragraph("Certifications", section_heading_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE_COLOR, spaceAfter=4, spaceBefore=1))

    certs = [
        ("Data Science & AI Diploma (243 Hours)", "AMIT Learning (2026)"),
        ("Full-Stack Web Development Diploma", "AMIT Learning (2024)"),
        ("Huawei AI Training", "Huawei Technologies (2022)")
    ]

    for c_name, c_meta in certs:
        story.append(Paragraph(f"• {c_name} &mdash; <i>{c_meta}</i>", dash_bullet_style))

    story.append(Spacer(1, 4))

    # 8. Languages
    story.append(Paragraph("Languages", section_heading_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE_COLOR, spaceAfter=4, spaceBefore=1))
    story.append(Paragraph("• <b>Arabic:</b> Native", dash_bullet_style))
    story.append(Paragraph("• <b>English:</b> Upper-Intermediate (B2)", dash_bullet_style))
    story.append(Spacer(1, 4))

    # 9. Personal Information
    story.append(Paragraph("Personal Information", section_heading_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=RULE_COLOR, spaceAfter=4, spaceBefore=1))
    story.append(Paragraph("Date of Birth: April 10, 2002 &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Nationality: Egyptian &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Military Status: Exempted", body_text_style))

    # Build Document
    doc.build(story, canvasmaker=AltaCVNumberedCanvas)
    print(f"Successfully generated exact AltaCV LaTeX PDF: {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == "__main__":
    generate_exact_altacv_pdf("Mikhail_Emad_Resume_2026.pdf")
