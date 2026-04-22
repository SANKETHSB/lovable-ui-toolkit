export const springBootBackendReference = {
  projectStructure: `
smart-vms-backend/
  pom.xml
  src/main/java/com/infosys/vms/SmartVmsApplication.java
  src/main/java/com/infosys/vms/config/SecurityConfig.java
  src/main/java/com/infosys/vms/controller/AuthController.java
  src/main/java/com/infosys/vms/controller/VendorController.java
  src/main/java/com/infosys/vms/controller/RfqController.java
  src/main/java/com/infosys/vms/controller/QuotationController.java
  src/main/java/com/infosys/vms/controller/PurchaseOrderController.java
  src/main/java/com/infosys/vms/controller/AuditLogController.java
  src/main/java/com/infosys/vms/controller/RoleController.java
  src/main/java/com/infosys/vms/dto/*.java
  src/main/java/com/infosys/vms/entity/*.java
  src/main/java/com/infosys/vms/repository/*.java
  src/main/java/com/infosys/vms/service/*.java
  src/main/java/com/infosys/vms/exception/GlobalExceptionHandler.java
  src/main/resources/application.yml
  src/main/resources/db/migration/V1__smart_vms_schema.sql
  src/test/java/com/infosys/vms/*Test.java
`,

  pomXml: `
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.5</version>
    <relativePath/>
  </parent>
  <groupId>com.infosys</groupId>
  <artifactId>smart-vms-backend</artifactId>
  <version>1.0.0</version>
  <name>Smart Vendor Procurement Management System</name>
  <properties>
    <java.version>17</java.version>
    <jjwt.version>0.12.6</jjwt.version>
    <mapstruct.version>1.6.2</mapstruct.version>
  </properties>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-mail</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-oauth2-client</artifactId></dependency>
    <dependency><groupId>org.springdoc</groupId><artifactId>springdoc-openapi-starter-webmvc-ui</artifactId><version>2.6.0</version></dependency>
    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-core</artifactId></dependency>
    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-mysql</artifactId></dependency>
    <dependency><groupId>com.mysql</groupId><artifactId>mysql-connector-j</artifactId><scope>runtime</scope></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-api</artifactId><version>\${jjwt.version}</version></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-impl</artifactId><version>\${jjwt.version}</version><scope>runtime</scope></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-jackson</artifactId><version>\${jjwt.version}</version><scope>runtime</scope></dependency>
    <dependency><groupId>org.modelmapper</groupId><artifactId>modelmapper</artifactId><version>3.2.1</version></dependency>
    <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><optional>true</optional></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.security</groupId><artifactId>spring-security-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.mockito</groupId><artifactId>mockito-core</artifactId><scope>test</scope></dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>
      <plugin><groupId>org.jacoco</groupId><artifactId>jacoco-maven-plugin</artifactId><version>0.8.12</version><executions><execution><goals><goal>prepare-agent</goal></goals></execution><execution><id>report</id><phase>test</phase><goals><goal>report</goal></goals></execution></executions></plugin>
    </plugins>
  </build>
</project>
`,

  applicationYml: `
server:
  port: 8080
  servlet:
    context-path: /api
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smart_vms?useSSL=true&serverTimezone=UTC
    username: vms_user
    password: change-me
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
  flyway:
    enabled: true
security:
  jwt:
    issuer: smart-vms
    access-token-minutes: 15
    refresh-token-days: 7
    secret: replace-with-256-bit-secret
`,

  mysqlSchema: `
CREATE TABLE users (id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255), is_active BOOLEAN NOT NULL DEFAULT TRUE, is_locked BOOLEAN NOT NULL DEFAULT FALSE, failed_attempts INT NOT NULL DEFAULT 0, last_login DATETIME, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE roles (id BIGINT PRIMARY KEY AUTO_INCREMENT, role_name VARCHAR(80) NOT NULL UNIQUE, description VARCHAR(255), protected_role BOOLEAN NOT NULL DEFAULT FALSE, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE user_roles (user_id BIGINT NOT NULL, role_id BIGINT NOT NULL, PRIMARY KEY(user_id, role_id), FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(role_id) REFERENCES roles(id));
CREATE TABLE permissions (id BIGINT PRIMARY KEY AUTO_INCREMENT, module_name VARCHAR(80) NOT NULL, action_name VARCHAR(20) NOT NULL);
CREATE TABLE role_permissions (role_id BIGINT NOT NULL, permission_id BIGINT NOT NULL, PRIMARY KEY(role_id, permission_id));
CREATE TABLE vendors (id BIGINT PRIMARY KEY AUTO_INCREMENT, company_name VARCHAR(150) NOT NULL, gst_number VARCHAR(30) NOT NULL UNIQUE, registration_id VARCHAR(50) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, status VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL', compliance_status VARCHAR(30) NOT NULL DEFAULT 'COMPLIANT', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, approved_at DATETIME);
CREATE TABLE compliance_documents (id BIGINT PRIMARY KEY AUTO_INCREMENT, vendor_id BIGINT NOT NULL, document_name VARCHAR(150) NOT NULL, document_type VARCHAR(60) NOT NULL, file_path VARCHAR(500) NOT NULL, issue_date DATE, expiry_date DATE, version INT NOT NULL DEFAULT 1, uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(vendor_id) REFERENCES vendors(id));
CREATE TABLE rfqs (id BIGINT PRIMARY KEY AUTO_INCREMENT, rfq_number VARCHAR(40) NOT NULL UNIQUE, title VARCHAR(160) NOT NULL, description TEXT, deadline DATETIME NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'OPEN', revision_number INT NOT NULL DEFAULT 1, created_by BIGINT NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE rfq_items (id BIGINT PRIMARY KEY AUTO_INCREMENT, rfq_id BIGINT NOT NULL, item_name VARCHAR(160) NOT NULL, quantity DECIMAL(14,2) NOT NULL, unit VARCHAR(40) NOT NULL, specifications TEXT, FOREIGN KEY(rfq_id) REFERENCES rfqs(id));
CREATE TABLE quotations (id BIGINT PRIMARY KEY AUTO_INCREMENT, rfq_id BIGINT NOT NULL, vendor_id BIGINT NOT NULL, total_price DECIMAL(14,2) NOT NULL, tax_amount DECIMAL(14,2) NOT NULL, currency VARCHAR(3) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', weighted_score DECIMAL(5,2), evaluation_comments TEXT, submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE purchase_orders (id BIGINT PRIMARY KEY AUTO_INCREMENT, po_number VARCHAR(40) NOT NULL UNIQUE, rfq_id BIGINT NOT NULL, vendor_id BIGINT NOT NULL, quotation_id BIGINT NOT NULL, total_cost DECIMAL(14,2) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'GENERATED', delivery_date DATE NOT NULL, pdf_path VARCHAR(500), generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE notifications (id BIGINT PRIMARY KEY AUTO_INCREMENT, user_id BIGINT, type VARCHAR(20) NOT NULL, subject VARCHAR(180) NOT NULL, message TEXT NOT NULL, is_read BOOLEAN NOT NULL DEFAULT FALSE, sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE audit_logs (id BIGINT PRIMARY KEY AUTO_INCREMENT, user_id BIGINT, action VARCHAR(100) NOT NULL, entity_type VARCHAR(80) NOT NULL, entity_id BIGINT, old_value JSON, new_value JSON, ip_address VARCHAR(64), timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_vendor_search ON vendors(company_name, gst_number);
CREATE INDEX idx_rfq_status_deadline ON rfqs(status, deadline);
CREATE INDEX idx_po_status ON purchase_orders(status);
`,

  coreJavaFiles: {
    main: `@SpringBootApplication\n@EnableScheduling\npublic class SmartVmsApplication { public static void main(String[] args) { SpringApplication.run(SmartVmsApplication.class, args); } }`,
    authController: `@RestController @RequestMapping("/auth") @RequiredArgsConstructor public class AuthController { private final AuthService authService; @PostMapping("/login") public JwtResponse login(@Valid @RequestBody LoginRequest request){ return authService.login(request); } @PostMapping("/refresh") public JwtResponse refresh(@RequestBody RefreshRequest request){ return authService.refresh(request); } @PostMapping("/password-reset/request") public void reset(@RequestBody OtpRequest request){ authService.sendOtp(request.email()); } }`,
    securityConfig: `@Configuration @EnableWebSecurity @RequiredArgsConstructor public class SecurityConfig { @Bean SecurityFilterChain filter(HttpSecurity http) throws Exception { return http.csrf(AbstractHttpConfigurer::disable).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authorizeHttpRequests(a -> a.requestMatchers("/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll().anyRequest().authenticated()).oauth2Login(Customizer.withDefaults()).build(); } }`,
    validationDto: `public record LoginRequest(@NotBlank @Email String email, @NotBlank @Size(min=8,max=128) String password) {}\npublic record VendorRequest(@NotBlank String companyName, @NotBlank String gstNumber, @NotBlank String registrationId, @Email String email) {}`,
  },

  endpoints: [
    'POST /api/auth/login - JWT login, failed attempts, lock after 5, audit log',
    'POST /api/auth/refresh - refresh token rotation',
    'POST /api/auth/password-reset/request - OTP/email reset',
    'POST /api/vendors/register - validation, duplicate detection, pending approval',
    'PUT /api/vendors/{id}/approve - admin approval, immutable audit',
    'PUT /api/vendors/{id}/reject - rejection reason mandatory',
    'POST /api/rfqs - future deadline, multi item, vendor invite',
    'PUT /api/rfqs/{id}/revision - versioning and field audit',
    'POST /api/quotations - deadline validation, positive price, docs',
    'POST /api/quotations/{id}/award - single award, RFQ lock, PO enabled',
    'POST /api/purchase-orders - awarded RFQ only, generated PDF',
    'GET /api/analytics - role dashboard KPIs',
    'GET /api/audit-logs - restricted immutable logs',
    'GET /api/reports/* - CSV/XLSX/PDF exports with permission checks',
  ],

  testing: `JUnit 5 + Mockito tests for services/controllers, Spring Security tests for 401/403, MockMvc API tests, JaCoCo >= 80%, SonarQube target Security A / Reliability A / Duplication <= 3%.`,
};
