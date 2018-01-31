CREATE TABLE public.academic_years (
	id                   serial NOT NULL,
	code                 varchar(100)  ,
	start_date           date  ,
	end_date             date  ,
	short_code           varchar(100)  ,
	active               integer  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_academic_years_id PRIMARY KEY ( id )
 );

CREATE TABLE public.assessment_type ( 
	id                   serial NOT NULL,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_assessment_type_id PRIMARY KEY ( id )
 );

CREATE TABLE public.board ( 
	id                   serial  ,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
    CONSTRAINT pk_board_id PRIMARY KEY ( id ),
	CONSTRAINT unq_board_id UNIQUE ( id ) 
 );

CREATE TABLE public.class_subjects ( 
	id                   serial  NOT NULL,
	class_id             integer  ,
	subject_id           integer  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_class_subjects_id PRIMARY KEY ( id )
 );

CREATE TABLE public.classes ( 
	id                   serial  NOT NULL,
	class_name           varchar(100)  NOT NULL,
	class_code           varchar(100)  NOT NULL,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_classes_id PRIMARY KEY ( id )
 );


CREATE TABLE public.clusters ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_clusters_id PRIMARY KEY ( id )
 );

CREATE TABLE public.components ( 
	id                   serial  NOT NULL,
	component_name       varchar(100)  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_components_id PRIMARY KEY ( id )
 );

CREATE TABLE public.payment_type ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_payment_type_id PRIMARY KEY ( id )
 );

CREATE TABLE public.paymode ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_paymode_id PRIMARY KEY ( id )
 );

CREATE TABLE public.permissions ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_permissions_id PRIMARY KEY ( id )
 );

CREATE TABLE public.permissions_role ( 
	id                   serial  NOT NULL,
	permission_id        integer  ,
	role_id              integer  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_permissions_role_id PRIMARY KEY ( id )
 );

CREATE TABLE public.pincode ( 
	id                   serial  NOT NULL,
	code                 integer  ,
	"state"              varchar(100)  ,
	city                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_pincode_id PRIMARY KEY ( id )
 );

CREATE TABLE public.school_status ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_school_status_id PRIMARY KEY ( id )
 );

CREATE TABLE public.school_type ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_school_type_id PRIMARY KEY ( id )
 );

CREATE TABLE public.schools ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  NOT NULL,
	code                 varchar(100)  ,
	logo                 varchar(100)  ,
	"location"           varchar(100)  ,
	school_type_id       integer  ,
	cover_img            varchar(100)  ,
	cluster_id           integer  ,
	"chain"              varchar(100)  ,
	acadminc_year_id     integer  ,
	estabished           varchar(100)  ,
	mission              varchar(100)  ,
	vision               varchar(100)  ,
	address_line1        varchar(100)  ,
	address_line2        varchar(100)  ,
	admin_telephone      varchar(20)  ,
	telephone2           varchar(20)  ,
	email                varchar(100)  ,
	pincode_id           integer  ,
	school_status_id     integer  NOT NULL,
	news_paper           varchar(100)  ,
	year_book            varchar(100)  ,
	website              varchar(100)  ,
	city                 varchar(100)  ,
	state                varchar(100)  ,
	created_at           date DEFAULT current_date ,
	updated_at           date DEFAULT current_date ,
	CONSTRAINT pk_school_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_schools_school_type_id ON public.schools ( school_type_id );

CREATE INDEX idx_schools_school_status_id ON public.schools ( school_status_id );

CREATE INDEX idx_schools_acadminc_year_id ON public.schools ( acadminc_year_id );


CREATE TABLE public.sections ( 
	id                   serial  NOT NULL,
	section_name         varchar(100)  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_sections_id PRIMARY KEY ( id )
 );

CREATE TABLE public.status ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_status_id PRIMARY KEY ( id )
 );

CREATE TABLE public.subjects ( 
	id                   serial  NOT NULL,
	name                 varchar(100)  NOT NULL,
	code                 varchar(100)  NOT NULL,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_subjects_id PRIMARY KEY ( id )
 );

CREATE TABLE public.unit_sequesnce ( 
	id                   serial  NOT NULL,
	board_id             integer  ,
	class_id             integer  ,
	subject_id           integer  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_unit_sequesnce_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_unit_sequesnce_board_id ON public.unit_sequesnce ( board_id );

CREATE INDEX idx_unit_sequesnce_subject_id ON public.unit_sequesnce ( subject_id );

CREATE INDEX idx_unit_sequesnce_class_id ON public.unit_sequesnce ( class_id );

CREATE TABLE public.user_details ( 
	id                   serial  NOT NULL,
	name                varchar(100)  ,
	address              varchar(1000)  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_user_details_id PRIMARY KEY ( id )
 );

CREATE TABLE public.user_role ( 
	id                   serial  NOT NULL,
	user_id              integer  ,
	role_id              integer  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_user_role_id PRIMARY KEY ( id ),
	CONSTRAINT unq_user_role_user_id UNIQUE ( user_id ) ,
	CONSTRAINT unq_user_role_role_id UNIQUE ( role_id ) 
 );

CREATE TABLE public.versions ( 
	id                   serial  NOT NULL,
	version_name         varchar(100)  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_versions_id PRIMARY KEY ( id )
 );

CREATE TABLE public.assessments ( 
	id                   serial  NOT NULL,
	unit_id              integer  ,
	type_id              integer  ,
	component_id         integer  ,
	code                 varchar  ,
	title                varchar  ,
	total_questions      integer  ,
	total_marks          integer  ,
	instructions         text  ,
	scoring_rubric       text  ,
	instructions_url     text  ,
	scoring_rubric_url   text  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_assessments_id PRIMARY KEY ( id ),
	CONSTRAINT unq_assessments_unit_id UNIQUE ( unit_id ) 
 );

CREATE INDEX idx_assessments_type_id ON public.assessments ( type_id );

CREATE INDEX idx_assessments_component_id ON public.assessments ( component_id );

CREATE TABLE public.documents ( 
	id                   serial  NOT NULL,
	doc_id               integer  NOT NULL,
	document_type        varchar(100)  NOT NULL,
	school_id            integer  NOT NULL,
	document_url         varchar(100)  NOT NULL,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_documents_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_documents_school_id ON public.documents ( school_id );

CREATE TABLE public.payement_details ( 
	id                   serial  NOT NULL,
	school_id            integer  NOT NULL,
	payment_type_id      integer  NOT NULL,
	invoices_no          varchar(100) ,
	currency             varchar(100)  ,
	amount               varchar(1000)  NOT NULL,
	installment_no       varchar(100)  ,
	invoice_date         date ,
	status_id            integer ,
	due_date             date  ,
	"comment"            varchar(1000)  ,
	pay_mode_id          integer  ,
	ref_no               varchar(100) ,
	payment_date         date ,
	bank_name            varchar(100)  ,
	created_at           date DEFAULT current_date ,
	updated_at           date DEFAULT current_date ,
	CONSTRAINT pk_payement_details_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_payement_details_school_id ON public.payement_details ( school_id );

CREATE INDEX idx_payement_details_pay_mode_id ON public.payement_details ( pay_mode_id );

CREATE INDEX idx_payement_details_payment_type_id ON public.payement_details ( payment_type_id );

CREATE INDEX idx_payement_details_status_id ON public.payement_details ( status_id );

CREATE TABLE public.questions ( 
	id                   serial  NOT NULL,
	assessment_id        integer  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_questions_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_questions_assessment_id ON public.questions ( assessment_id );

CREATE TABLE public.roles ( 
	id                   serial  NOT NULL,
	role_name            varchar(100)  ,
	role_type            varchar(100)  ,
	created_at           date DEFAULT current_date ,
	updated_at           date DEFAULT current_date ,
	CONSTRAINT pk_roles_id PRIMARY KEY ( id )
 );

CREATE TABLE public.school_users ( 
	id                   serial  NOT NULL,
	school_id            integer  NOT NULL,
	name                 varchar(100)  NOT NULL,
	designation          varchar(100)  NOT NULL,
	status               varchar(100)  NOT NULL,
	access_till           date  NOT NULL,
	email_id             varchar(100)  ,
	mobile               varchar(15)  ,
	role_id              integer  NOT NULL,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_school_user_id PRIMARY KEY ( id )
 );


CREATE TABLE public.users ( 
	id                   serial  NOT NULL,
	email_id             varchar(100)  NOT NULL,
	mobile               bigint  NOT NULL,
	"password"           varchar(100)  NOT NULL,
	userdetails_id       integer  NOT NULL,
	status               varchar(100)  NOT NULL,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_users_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_users_userdetails_id ON public.users ( userdetails_id );

CREATE TABLE public.user_otp ( 
	id                   serial  NOT NULL,
	otp_code             integer  NOT NULL,
	user_id              integer  NOT NULL,
	type                 varchar(100)  NOT NULL,
	expiredAt            timestamp  ,
	created_at           date DEFAULT current_date ,
	updated_at           date DEFAULT current_date ,
	CONSTRAINT pk_otp_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_otp_user_id ON public.user_otp ( user_id );

CREATE TABLE public.class_unit ( 
	id                   serial  NOT NULL,
	class_id             integer  ,
	unit_id              integer  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_class_unit_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_class_unit_unit_id ON public.class_unit ( unit_id );

CREATE INDEX idx_class_unit_class_id ON public.class_unit ( class_id );

CREATE TABLE public.day_plan ( 
	id                   serial  NOT NULL,
	unit_id              integer  ,
	resource_id          integer  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_day_plan_id PRIMARY KEY ( id ),
	CONSTRAINT unq_day_plan_unit_id UNIQUE ( unit_id ) 
 );

CREATE INDEX idx_day_plan_resource_id ON public.day_plan ( resource_id );

CREATE TABLE public.day_plan_content ( 
	id                   serial  NOT NULL,
	component_id         integer  ,
	section_id           integer  ,
	day_plan_id          integer  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_day_plan_content_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_day_plan_content_component_id ON public.day_plan_content ( component_id );

CREATE INDEX idx_day_plan_content_section_id ON public.day_plan_content ( section_id );

CREATE INDEX idx_day_plan_content_day_plan_id ON public.day_plan_content ( day_plan_id );

CREATE TABLE public.day_plan_li ( 
	id                   serial  NOT NULL,
	day_plan_id          integer  ,
	li_id                integer  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_day_plan_li_id PRIMARY KEY ( id ),
	CONSTRAINT unq_day_plan_li_day_plan_id UNIQUE ( day_plan_id ) 
 );

CREATE INDEX idx_day_plan_li_li_id ON public.day_plan_li ( li_id );

CREATE TABLE public.learning_indicators ( 
	id                   serial  NOT NULL,
	lo_id                integer  ,
	title                varchar  ,
	sequence_code        integer  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_learning_indicators_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_learning_indicators_lo_id ON public.learning_indicators ( lo_id );

CREATE TABLE public.learning_outcomes ( 
	id                   serial  NOT NULL,
	unit_id              integer  ,
	title                varchar  ,
	lo_type              varchar  ,
	remarks              varchar  ,
	sequence_code        varchar  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_learning_outcomes_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_learning_outcomes_unit_id ON public.learning_outcomes ( unit_id );

CREATE TABLE public.resource_type ( 
	id                   serial  NOT NULL,
	title                varchar  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_resource_type_id PRIMARY KEY ( id )
 );

CREATE TABLE public.resources ( 
	id                   serial  NOT NULL,
	type_id              integer  ,
	unit_id              integer  ,
	resource_name        varchar(100)  ,
	file_url             varchar  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_resources_id PRIMARY KEY ( id ),
	CONSTRAINT unq_resources_type_id UNIQUE ( type_id ) 
 );

CREATE INDEX idx_resources_unit_id ON public.resources ( unit_id );

CREATE TABLE public.sub_questions ( 
	id                   serial  NOT NULL,
	question_id          integer  ,
	li_id                integer  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_sub_questions_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_sub_questions_question_id ON public.sub_questions ( question_id );

CREATE INDEX idx_sub_questions_li_id ON public.sub_questions ( li_id );

CREATE TABLE public.task_type ( 
	id                   serial  NOT NULL,
	task_type_name       varchar(100)  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_task_type_id PRIMARY KEY ( id )
 );

CREATE TABLE public.unit_sequence_uinit ( 
	id                   serial  NOT NULL,
	unit_id              integer  ,
	unit_sequence_id     integer  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_unit_sequence_init_id PRIMARY KEY ( id )
 );

CREATE INDEX idx_unit_sequenceuinit_unit_sequence_id ON public.unit_sequence_uinit ( unit_sequence_id );

CREATE INDEX idx_unit_sequence_uinit_unit_id ON public.unit_sequence_uinit ( unit_id );

CREATE TABLE public.unit_tasks ( 
	id                   serial  NOT NULL,
	unit_id              integer  ,
	assign_by            integer  ,
	assign_to            integer  ,
	status               char(1)  ,
	task_type_id         integer  ,
	created_at            date DEFAULT current_date ,
	updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_unit_tasks_id PRIMARY KEY ( id ),
	CONSTRAINT unq_unit_tasks_task_type_id UNIQUE ( task_type_id ) 
 );

CREATE INDEX idx_unit_tasks_unit_id ON public.unit_tasks ( unit_id );

CREATE INDEX idx_unit_tasks_assign_by ON public.unit_tasks ( assign_by );

CREATE INDEX idx_unit_tasks_assign_to ON public.unit_tasks ( assign_to );

CREATE TABLE public.units ( 
	id                   serial  NOT NULL,
	subject_id           integer  ,
	version_id           integer  ,
	parent_unit_id       integer  ,
	created_at            date DEFAULT current_date ,
    updated_at            date DEFAULT current_date ,
	CONSTRAINT pk_units_id PRIMARY KEY ( id )
 );


CREATE INDEX idx_units_version_id ON public.units ( version_id );

CREATE INDEX idx_units_subject_id ON public.units ( subject_id );

ALTER TABLE public.assessments ADD CONSTRAINT fk_assessments_assessment_type FOREIGN KEY ( type_id ) REFERENCES public.assessment_type( id );

ALTER TABLE public.assessments ADD CONSTRAINT fk_assessments_components FOREIGN KEY ( component_id ) REFERENCES public.components( id );

ALTER TABLE public.class_unit ADD CONSTRAINT fk_class_unit_units FOREIGN KEY ( unit_id ) REFERENCES public.units( id );

ALTER TABLE public.class_unit ADD CONSTRAINT fk_class_unit_classes FOREIGN KEY ( class_id ) REFERENCES public.classes( id );

ALTER TABLE public.day_plan ADD CONSTRAINT fk_day_plan_day_plan_li FOREIGN KEY ( id ) REFERENCES public.day_plan_li( day_plan_id );

ALTER TABLE public.day_plan ADD CONSTRAINT fk_day_plan_resources FOREIGN KEY ( resource_id ) REFERENCES public.resources( id );

ALTER TABLE public.day_plan_content ADD CONSTRAINT fk_day_plan_content_components FOREIGN KEY ( component_id ) REFERENCES public.components( id );

ALTER TABLE public.day_plan_content ADD CONSTRAINT fk_day_plan_content_sections FOREIGN KEY ( section_id ) REFERENCES public.sections( id );

ALTER TABLE public.day_plan_content ADD CONSTRAINT fk_day_plan_content_day_plan FOREIGN KEY ( day_plan_id ) REFERENCES public.day_plan( id );

ALTER TABLE public.day_plan_li ADD CONSTRAINT fk_day_plan_li_learning_indicators FOREIGN KEY ( li_id ) REFERENCES public.learning_indicators( id );

ALTER TABLE public.documents ADD CONSTRAINT fk_documents_school FOREIGN KEY ( school_id ) REFERENCES public.schools( id );

ALTER TABLE public.learning_indicators ADD CONSTRAINT fk_learning_indicators_learning_outcomes FOREIGN KEY ( lo_id ) REFERENCES public.learning_outcomes( id );

ALTER TABLE public.learning_outcomes ADD CONSTRAINT fk_learning_outcomes_units FOREIGN KEY ( unit_id ) REFERENCES public.units( id );

ALTER TABLE public.payement_details ADD CONSTRAINT fk_payement_details_school FOREIGN KEY ( school_id ) REFERENCES public.schools( id );

ALTER TABLE public.payement_details ADD CONSTRAINT fk_payement_details_paymode FOREIGN KEY ( pay_mode_id ) REFERENCES public.paymode( id );

ALTER TABLE public.payement_details ADD CONSTRAINT fk_payement_details_payment_type FOREIGN KEY ( payment_type_id ) REFERENCES public.payment_type( id );

ALTER TABLE public.payement_details ADD CONSTRAINT fk_payement_details_status FOREIGN KEY ( status_id ) REFERENCES public.status( id );

ALTER TABLE public.permissions_role ADD CONSTRAINT fk_permissions_role_permissions FOREIGN KEY ( permission_id ) REFERENCES public.permissions( id );

ALTER TABLE public.questions ADD CONSTRAINT fk_questions_assessments FOREIGN KEY ( assessment_id ) REFERENCES public.assessments( id );

ALTER TABLE public.resources ADD CONSTRAINT fk_resources_units FOREIGN KEY ( unit_id ) REFERENCES public.units( id );

ALTER TABLE public.school_users ADD CONSTRAINT fk_school_user_school FOREIGN KEY ( school_id ) REFERENCES public.schools( id );

ALTER TABLE public.school_users ADD CONSTRAINT fk_school_user_roles FOREIGN KEY ( role_id ) REFERENCES public.roles( id );

ALTER TABLE public.schools ADD CONSTRAINT fk_schools_school_type FOREIGN KEY ( school_type_id ) REFERENCES public.school_type( id );

ALTER TABLE public.schools ADD CONSTRAINT fk_schools_clusters_0 FOREIGN KEY ( cluster_id ) REFERENCES public.clusters( id );

ALTER TABLE public.schools ADD CONSTRAINT fk_schools_school_status FOREIGN KEY ( school_status_id ) REFERENCES public.school_status( id );

ALTER TABLE public.schools ADD CONSTRAINT fk_schools_academic_years FOREIGN KEY ( acadminc_year_id ) REFERENCES public.academic_years( id );

ALTER TABLE public.sub_questions ADD CONSTRAINT fk_sub_questions_questions FOREIGN KEY ( question_id ) REFERENCES public.questions( id );

ALTER TABLE public.sub_questions ADD CONSTRAINT fk_sub_questions_learning_indicators FOREIGN KEY ( li_id ) REFERENCES public.learning_indicators( id );

ALTER TABLE public.task_type ADD CONSTRAINT fk_task_type_unit_tasks FOREIGN KEY ( id ) REFERENCES public.unit_tasks( task_type_id );

ALTER TABLE public.unit_sequence_uinit ADD CONSTRAINT fk_unit_sequenceuinit_unit_sequesnce FOREIGN KEY ( unit_sequence_id ) REFERENCES public.unit_sequesnce( id );

ALTER TABLE public.unit_sequence_uinit ADD CONSTRAINT fk_unit_sequence_uinit_units FOREIGN KEY ( unit_id ) REFERENCES public.units( id );

ALTER TABLE public.unit_sequesnce ADD CONSTRAINT fk_unit_sequesnce_board FOREIGN KEY ( board_id ) REFERENCES public.board( id );

ALTER TABLE public.unit_sequesnce ADD CONSTRAINT fk_unit_sequesnce_subjects FOREIGN KEY ( subject_id ) REFERENCES public.subjects( id );

ALTER TABLE public.unit_sequesnce ADD CONSTRAINT fk_unit_sequesnce_classes FOREIGN KEY ( class_id ) REFERENCES public.classes( id );

ALTER TABLE public.unit_tasks ADD CONSTRAINT fk_unit_tasks_units FOREIGN KEY ( unit_id ) REFERENCES public.units( id );

ALTER TABLE public.unit_tasks ADD CONSTRAINT fk_unit_tasks_users FOREIGN KEY ( assign_by ) REFERENCES public.users( id );

ALTER TABLE public.unit_tasks ADD CONSTRAINT fk_unit_tasks_users_0 FOREIGN KEY ( assign_to ) REFERENCES public.users( id );

ALTER TABLE public.units ADD CONSTRAINT fk_units_versions FOREIGN KEY ( version_id ) REFERENCES public.versions( id );

ALTER TABLE public.units ADD CONSTRAINT fk_units_subjects FOREIGN KEY ( subject_id ) REFERENCES public.subjects( id );

ALTER TABLE public.units ADD CONSTRAINT fk_units_day_plan FOREIGN KEY ( id ) REFERENCES public.day_plan( unit_id );

ALTER TABLE public.units ADD CONSTRAINT fk_units_assessments FOREIGN KEY ( id ) REFERENCES public.assessments( unit_id );

ALTER TABLE public.user_otp ADD CONSTRAINT fk_otp_users FOREIGN KEY ( user_id ) REFERENCES public.users( id );

ALTER TABLE public.users ADD CONSTRAINT fk_users_user_details FOREIGN KEY ( userdetails_id ) REFERENCES public.user_details( id );

CREATE TABLE public.divisions (
  	id                   serial  NOT NULL,
  	name                 varchar(100) NOT NULL,
  	created_at           date DEFAULT current_date ,
  	updated_at           date DEFAULT current_date ,
  	CONSTRAINT pk_divisions_id PRIMARY KEY ( id )
   );

CREATE TABLE public.school_classes (
    id                   serial  NOT NULL,
 	school_id            integer NOT NULL,
 	class_id             integer NOT NULL,
 	division_id          integer ,
 	academic_year_id     integer ,
 	school_user_id       integer ,
 	total_student        integer ,
 	created_at           date DEFAULT current_date ,
 	updated_at           date DEFAULT current_date ,
 	CONSTRAINT pk_school_classes_id PRIMARY KEY ( id )
  );

  ALTER TABLE public.school_classes ADD CONSTRAINT fk_school_classes_schools FOREIGN KEY ( school_id ) REFERENCES public.schools( id );

  ALTER TABLE public.school_classes ADD CONSTRAINT fk_school_classes_classes FOREIGN KEY ( class_id ) REFERENCES public.classes( id );

  ALTER TABLE public.school_classes ADD CONSTRAINT fk_school_classes_divisions FOREIGN KEY ( division_id ) REFERENCES public.divisions( id );

  ALTER TABLE public.school_classes ADD CONSTRAINT fk_school_classes_academic_years FOREIGN KEY ( academic_year_id ) REFERENCES public.academic_years( id );

  ALTER TABLE public.school_classes ADD CONSTRAINT fk_school_classes_school_users FOREIGN KEY ( school_user_id ) REFERENCES public.school_users( id );

 CREATE TABLE public.school_subjects (
   	id                   serial  NOT NULL,
   	school_id            integer NOT NULL,
   	class_id           integer NOT NULL,
   	subject_id           integer NOT NULL,
   	division_id          integer ,
   	academic_year_id     integer ,
   	school_user_id       integer ,
   	unit_sequence_id     integer ,
   	created_at           date DEFAULT current_date ,
   	updated_at           date DEFAULT current_date ,
   	CONSTRAINT pk_school_subjects_id PRIMARY KEY ( id )
    );

    ALTER TABLE public.school_subjects ADD CONSTRAINT fk_school_subjects_schools FOREIGN KEY ( school_id ) REFERENCES public.schools( id );

    ALTER TABLE public.school_subjects ADD CONSTRAINT fk_school_subjects_classes FOREIGN KEY ( class_id ) REFERENCES public.classes( id );

    ALTER TABLE public.school_subjects ADD CONSTRAINT fk_school_subjects_subjects FOREIGN KEY ( subject_id ) REFERENCES public.subjects( id );

    ALTER TABLE public.school_subjects ADD CONSTRAINT fk_school_subjects_divisions FOREIGN KEY ( division_id ) REFERENCES public.divisions( id );

    ALTER TABLE public.school_subjects ADD CONSTRAINT fk_school_subjects_academic_years FOREIGN KEY ( academic_year_id ) REFERENCES public.academic_years( id );

    ALTER TABLE public.school_subjects ADD CONSTRAINT fk_school_subjects_school_users FOREIGN KEY ( school_user_id ) REFERENCES public.school_users( id );

    ALTER TABLE public.school_subjects ADD CONSTRAINT fk_school_subjects_unit_sequesnce FOREIGN KEY ( unit_sequence_id ) REFERENCES public.unit_sequesnce( id );

 /* 2 Jan 2018 */
 ALTER TABLE classes ADD COLUMN class_type varchar(100);

/* 4 Jan 2018 */
 ALTER TABLE school_classes ADD COLUMN perschool_kits integer;

 ALTER TABLE school_classes ADD COLUMN midschool_kits integer;

 ALTER TABLE school_subjects ADD COLUMN board_id integer;

 ALTER TABLE public.school_subjects ADD CONSTRAINT fk_school_subjects_board FOREIGN KEY ( board_id ) REFERENCES public.board( id );

/* 9 Jan 2018 */
CREATE TABLE public.designations (
  id serial  NOT NULL,
  name character varying(100) NOT NULL,
  created_at           date DEFAULT current_date ,
  updated_at           date DEFAULT current_date ,
  is_enabled boolean NOT NULL DEFAULT true,
  CONSTRAINT pk_designations_id PRIMARY KEY ( id )
)


ALTER TABLE school_users DROP COLUMN designation;

ALTER TABLE school_users ADD COLUMN designation_id integer;

ALTER TABLE public.school_users ADD CONSTRAINT fk_school_user_designation FOREIGN KEY ( designation_id ) REFERENCES public.designations( id );

/* 25 Jan 2018 */
ALTER TABLE schools ALTER COLUMN logo type character(1000);

ALTER TABLE schools ALTER COLUMN cover_img type character(1000);