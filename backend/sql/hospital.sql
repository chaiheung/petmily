USE prj3;

CREATE TABLE hospital
(
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    address     VARCHAR(255) NOT NULL,
    call_number VARCHAR(255) NOT NULL UNIQUE


);

INSERT INTO hospital(name, address, call_number)
VALUES ('서울 성윤모 병원', '서울특별시 성북구 이대로 111', '02-1111-1111');

# 댓글 테이블
CREATE TABLE hospital_comment
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    board_id  INT          NOT NULL REFERENCES hospital (hospital_id),
    member_id INT          NOT NULL REFERENCES member (id),
    comment   VARCHAR(500) NOT NULL,
    inserted  DATETIME     NOT NULL DEFAULT NOW()
);
SELECT *
FROM hospital_comment;