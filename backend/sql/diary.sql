CREATE TABLE diary
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    title     VARCHAR(100)  NOT NULL,
    content   VARCHAR(1000) NOT NULL,
    inserted  DATETIME      NOT NULL DEFAULT NOW(),
    member_id INT           NOT NULL REFERENCES member (id),
    nickname  VARCHAR(255)  NOT NULL REFERENCES member (nickname),
    username  VARCHAR(255)  NOT NULL
);



ALTER TABLE diary
    ADD username VARCHAR(255) NOT NULL;


SELECT COUNT(*)
FROM diary;

SHOW CREATE TABLE diaryComment;
START TRANSACTION;

SELECT *
FROM diary;
-- 외부 키 제약 조건 제거
ALTER TABLE diaryComment
    DROP FOREIGN KEY fk_diaryMemberId;

-- 컬럼 이름 변경
ALTER TABLE diaryComment
    CHANGE memberId member_id INT;
ALTER TABLE diary
    DROP COLUMN writer;

UPDATE diary
SET member_id = (SELECT id FROM member ORDER BY id DESC LIMIT 1)
WHERE id > 0;

SELECT *
FROM diaryComment;

CREATE TABLE diaryComment
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    comment   VARCHAR(1000) NOT NULL,
    inserted  DATETIME      NOT NULL DEFAULT NOW(),
    member_id INT           NOT NULL REFERENCES member (id),
    nickname  VARCHAR(255)  NOT NULL REFERENCES member (nickname)
);

DROP TABLE diaryComment;


SELECT *
FROM diaryComment;

-- 외부 키 제약 조건 다시 추가 (새로운 이름으로)
ALTER TABLE diaryComment
    ADD CONSTRAINT fk_diaryComment_memberId FOREIGN KEY (member_id) REFERENCES member (id);

COMMIT;


-- 컬럼 이름 변경
ALTER TABLE diaryComment
    CHANGE member_id memberId INT;

-- 외부 키 제약 조건 다시 추가
ALTER TABLE diaryComment
    ADD CONSTRAINT fk_diaryMemberId FOREIGN KEY (memberId) REFERENCES member (id);


-- 기존껀데 잠시 나둠
CREATE TABLE diaryComment
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    comment   VARCHAR(1000) NOT NULL,
    inserted  DATETIME      NOT NULL DEFAULT NOW(),
    member_id INT           NOT NULL REFERENCES member (id),
    nickname  VARCHAR(255)  NOT NULL REFERENCES member (nickname)
);
DROP TABLE diaryComment;



SELECT *
FROM diaryComment;

DROP TABLE diaryComment;

SELECT *
FROM diary
WHERE id = 1;

DESC diary;

DROP TABLE diaryComment;

SELECT *
FROM diaryComment;

CREATE TABLE diary_file
(
    diary_id INT          NOT NULL REFERENCES diary (id),
    name     VARCHAR(500) NOT NULL,
    PRIMARY KEY (diary_id, name)
);

UPDATE diary
SET member_id = 18
WHERE id % 2 = 0;
UPDATE diary
SET member_id = 19
WHERE id % 2 = 1;

UPDATE diary
SET title   = 'abc def',
    content = 'ghi jkl'
WHERE id % 3 = 0;
UPDATE diary
SET title   = 'mno pqr',
    content = 'stu vwx'
WHERE id % 3 = 1;
UPDATE diary
SET title   = 'yz1 234',
    content = '567 890'
WHERE id % 3 = 2;

CREATE TABLE members
(
    member_id     INT AUTO_INCREMENT PRIMARY KEY,
    intro         TEXT,
    profile_image VARCHAR(255),
    guest_book    TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE diary_profile
(
    member_id  INT PRIMARY KEY,
    intro      TEXT,
    guest_book TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES member (id)
);

ALTER TABLE diary_profile
    CHANGE COLUMN condition_message status_message TEXT;

ALTER TABLE diary_profile
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

DROP TABLE diary_file;