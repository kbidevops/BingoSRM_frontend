// 정책 ( Category )

export enum AccountTypeEnum {
  ROOT = "root",
  USER = "user",
}

export enum AuthTypeEnum {
  PASSWORD = "Password",
  KEY = "Key",
  NO_PASSWORD = "NoPassword",
}

export enum ShellTypeEnum {
  CMD = "cmd",
  POWERSHELL = "powershell",
}

export enum TwoFactorAuthEnum {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
  CUSTOM = "CUSTOM",
}

export enum CategoryEnum {
  ALL = "ALL", // ALL
  UNIX = "UNIX", // 유닉스
  LINUX = "LINUX", // 리눅스
  WINDOWS = "WINDOWS", // 윈도우
  WEB = "WEB", // 웹/응용프로그램
  NETWORK = "NETWORK", // 네트워크
  DATABASE = "DATABASE", // 데이터베이스
  SECURITY = "SECURITY", // 정보보안
  CLOUD = "CLOUD", // 클라우드
  CYBERS = "CYBERS", // 사이버보안
  BPFDOOR = "BPFDOOR", // BPFDoor
  PC = "PC", // PC
}

export enum ConnectionTypeEnum {
  AGENT = "AGENT",
  NON_AGENT = "NONAGENT",
  CLOUD = "CLOUD",
}

export enum DayOfTheWeekEnum {
  MON = "1",
  TUE = "2",
  WED = "3",
  THU = "4",
  FRI = "5",
  SAT = "6",
  SUN = "7",
}

// special Error Codes that require frontend intervention + UI
export enum ErrorCodeEnum {
  "ERR-CCE-DUPSTQ" = "ERR-CCE-DUPSTQ",
  "ERR-SECHK-DEPTCONQ" = "ERR-SECHK-DEPTCONQ",
  "ERR-SECHK-DUPCONQ" = "ERR-SECHK-DUPCONQ",
  "ERR-AST-DUPSTQ" = "ERR-AST-DUPSTQ",
  "ERR-AST-LADQ" = "ERR-AST-LADQ",
}

export enum GuideTypeEnum {
  KISA = "KISA",
  ADD = "ADD",
  FSI = "FSI",
}

export enum IconEnum {
  APP_GROUP_PERMISSIONS = "APP_GROUP_PERMISSIONS",
  ASSET_NAME = "ASSET_NAME",
  ASSET_NUMBER = "ASSET_NUMBER",
  CREATED_DATE = "CREATED_DATE",
  DATABASE_NAME = "DATABASE_NAME",
  DEPT = "DEPT",
  DESCRIPTION = "DESCRIPTION",
  DIRECTORY = "DIRECTORY",
  DOMAIN_NAME = "DOMAIN_NAME",
  DONE_ALL = "DONE_ALL",
  EMAIL = "EMAIL",
  HOSTNAME = "HOSTNAME",
  IP = "IP",
  MODIFIED_DATE = "MODIFIED_DATE",
  OS = "OS",
  PASSWORD = "PASSWORD",
  PATCH = "PATCH",
  PHONE = "PHONE",
  PORT = "PORT",
  ROLE = "ROLE",
  SCAN_DATE = "SCAN_DATE",
  SUB_DEPT = "SUB_DEPT",
  USER = "USER",
  USERNAME = "USERNAME",
  USER_ASSET_LIST = "USER_ASSET_LIST",
  VERSION = "VERSION",
  VUL = "VUL",
  VUL_SCORE_SUM = "VUL_SCORE_SUM",
  VUL_SCORE_PERC = "VUL_SCORE_PERC",
  PATH = "PATH",
  RTO = "RTO",
  RPO = "RPO",
  RECOVERY_PRIORITY = "RECOVERY_PRIORITY",
  MANAGER = "MANAGER",
  SCAN_SCHEDULE = "SCAN_SCHEDULE",
  CRITICALITY = "CRITICALITY",
}

export enum FilterTypeEnum {
  DEPT_NAME = "deptName",
  TYPE = "type",
  VERSION = "version",
  YEAR = "year",
}

export enum LogTypeEnum {
  AUTH = "AUTH",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  DOWNLOAD = "DOWNLOAD",
  ERROR = "ERROR",
  LGN = "LGN",
  LOGOUT = "LOGOUT",
  SAVE = "SAVE",
  SCAN = "SCAN",
  SEARCH = "SEARCH",
  WRITE = "WRITE",
}

export enum MonthEnum {
  JAN = "jan",
  FEB = "feb",
  MAR = "mar",
  APR = "apr",
  MAY = "may",
  JUN = "jun",
  JUL = "jul",
  AUG = "aug",
  SEP = "sep",
  OCT = "oct",
  NOV = "nov",
  DEC = "dec",
}

export enum PatchResultEnum {
  PATCH_COM = "PATCH_COM",
  PATCH_DUE = "PATCH_DUE",
  PATCH_EXC = "PATCH_EXC",
}

// 관리자 승인 ( Checked )
export enum PatchCheckedEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

// 중요도 ( Priority )
export enum PriorityEnum {
  HIGH = "HIGH", // 상
  MID = "MID", // 중
  LOW = "LOW", // 하
}

export enum KoreanPriorityEnum {
  HIGH = "상", // 상
  MID = "중", // 중
  LOW = "하", // 하
}

// 자동진단 스케줄러 ( Repeat )
export enum RepeatEnum {
  DISABLED = "DISABLED",
  YEARLY = "YEARLY",
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY",
  CUSTOM = "CUSTOM",
}

// 역할 ( Role )
export enum RoleEnum {
  KBI = "KBI",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
}

// 진단 권한 ( Scan Perm )
export enum ScanPermEnum {
  SU = "su",
  SUDO = "sudo",
}

// 진단 결과 ( Scan Result )
export enum ScanResultEnum {
  SEC = "SEC", // 양호
  VUL = "VUL", // 취약
  EXC = "EXC", // 예외
  MAN = "MAN", // 수동
  ERR = "ERR", // 에러
  PRT = "PRT", // 부분 만족
  NA = "NA",
}

// 진단 방식 ( Scan Type )
export enum ScanTypeEnum {
  MANUAL = "MANUAL", // 수동 진단
  AUTO = "AUTO", // 자동 진단
}

export enum AgentStatusEnum {
  PENDING = "PENDING",
  INSTALLING = "INSTALLING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ERROR = "ERROR",
}
// 진단 상태 ( Scan Status )
export enum ScanStatusEnum {
  CANCELED = "CANCELED",
  CANCELING = "CANCELING",
  COMPLETED = "COMPLETED",

  AGENT_ERROR = "AGENT_ERROR",
  ATC_ERROR = "ATC_ERROR",
  CONNECTION_ERROR = "CONNECTION_ERROR",
  PERMISSION_ERROR = "PERMISSION_ERROR",
  RESOURCE_ERROR = "RESOURCE_ERROR",
  RESULT_ERROR = "RESULT_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",

  INCOMPLETE = "INCOMPLETE",
  INIT = "INIT",
  PROCESSING = "PROCESSING",
  WARNING = "WARNING",
  ERROR = "ERROR",
  COMPLIANCE_ERROR = "COMPLIANCE_ERROR",
  PENDING = "PENDING",
}

export enum SeverityEnum {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum SiteInspectionMarkEnum {
  NEW_GROUP = "NEW_GROUP",
  NEW_GUIDE = "NEW_GUIDE",
  OLD_GROUP = "OLD_GROUP",
  OLD_GUIDE = "OLD_GUIDE",
}

export enum SiteInspectionResultEnum {
  SEC = "SEC", // 양호
  VUL = "VUL", // 취약
  EXC = "EXC", // 예외
  PRT = "PRT", // 부분 만족
}

export enum SiteInspectionTypeEnum {
  PV = "PV",
  AV = "AV",
}

export enum SpecTypeEnum {
  LOG = "LOG",
  RESULT = "RESULT",
}

export enum SubCategoryServerEnum {
  AIX = "AIX",
  // CENTOS = 'CentOS',
  DEB = "DEB",
  // FEDORA = 'Fedora',
  HPUX = "HPUX",
  // ORACLELINUX = 'OracleLinux',
  RPM = "RPM",
  // ROCKY = 'Rocky Linux',
  SOLARIS = "SUN",
  // UBUNTU = 'Ubuntu',
  WSV = "WSV",
}

export enum SubCategoryDatabaseEnum {
  MARIADB = "MARIADB",
  MYSQL = "MYSQL",
  MSSQL = "MSSQL",
  ORACLE = "ORACLE",
  POSTGRESQL = "POSTGRESQL",
}

export enum SubCategoryNetworkEnum {
  CISCOR = "CISCOR",
  CISCOSW = "CISCOSW",
  // PIOLINKR = 'PIOLINKR',
  // PIOLINKSW = 'PIOLINKSW',
}

export enum SubCategoryPcEnum {
  WINPC = "WINPC",
  // MAC = 'MAC',
}

export enum SubCategorySecurityEnum {
  SECURITY = "SECURITY",
}

export enum SubCategoryVmEnum {
  RPMC = "RPMC",
  DEBC = "DEBC",
  WINDOWSC = "WINDOWSC",
  DOCKER = "DOCKER",
  ESXI = "ESXI",
  HYPERV = "HYPERV",
  KVM = "KVM",
  KUBERM = "KUBERM",
  KUBERW = "KUBERW",
  OPENSTACK = "OPENSTACK",
  XENSERVER = "XENSERVER",
}

// Cyber Security
export enum SubCategoryCybersEnum {
  AIXCS = "AIXCS",
  HPUXCS = "HPUXCS",
  SUNCS = "SUNCS",
  RPMCS = "RPMCS",
  DEBCS = "DEBCS",
  WINDOWSCS = "WINDOWSCS",
}

// BPFDoor
export enum SubCategoryBpfDoorEnum {
  LINUXB = "LINUXB",
}

export enum SubCategoryWebEnum {
  APACHE = "APACHE",
  IIS = "IIS",
  NGINX = "NGINX",
  // JEUS = 'JEUS',
  TOMCAT = "TOMCAT",
  // WEBLOGIC = 'WEBLOGIC',
}

export enum Permission {
  KBI = "rwxrwxrwxrwx",
  ADMIN = "rwxrwxrwx",
  MANAGER = "rwxrwxr--",
  USER = "rwxr-x---",
}

export enum TargetOrganization {
  OTHERS = "OTHERS",
  ADD = "ADD",
}

//Category: database
//SubCategory: mariadb or mysql or oracle
export enum CategoryByDb1Enum {
  LINUX = "LINUX", // 리눅스
  WINDOWS = "WINDOWS", // 윈도우
}

//Category: database
//SubCategory: mariadb or mysql
export enum CategoryByDb2Enum {
  WINDOWS = "WINDOWS", // 윈도우
}

export enum CategoryByDb3Enum {
  LINUX = "LINUX", // 리눅스
}

export enum PatternEnum {
  NONE = "NONE",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

export enum RiskLevelEnum {
  HIGH = "상",
  MID = "중",
  LOW = "하",
}
