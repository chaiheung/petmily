package com.backend.mapper.diary;

import com.backend.domain.diary.DiaryComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DiaryCommentMapper {

    @Insert("""
            INSERT INTO diaryComment
            (member_id,comment,nickname)
            VALUES (#{memberId},#{comment},#{nickname})
            """)
    public int diaryCommentInsert(DiaryComment diaryComment);

    @Select("""
            SELECT
                c.id,
                c.comment,
                c.inserted,
                c.member_id,
                m.nickname
                FROM diaryComment c JOIN member m ON c.member_id = m.id
                ORDER BY c.id DESC
            """)
    List<DiaryComment> selectByDiaryId();


    @Delete("""
            DELETE FROM diaryComment
            WHERE id = #{id}
            """)
    int deleteById(Integer id);


    @Select("""
                SELECT *
                FROM diaryComment
                WHERE id = #{id}
            """)
    DiaryComment selectById(Integer id);

    @Update("""
                UPDATE diaryComment
                SET comment = #{comment}
                WHERE id = #{id}
            """)
    int diaryUpdate(DiaryComment diaryComment);

    @Select("""
            SELECT *
            FROM diaryComment
            WHERE id = #{id}
            """)
    int selectgetById(Integer id);

    @Select("""
            SELECT *
            FROM diaryComment
            ORDER BY inserted DESC
            LIMIT #{limit} OFFSET #{offset}
            """)
    List<DiaryComment> selectAll(@Param("limit") int limit, @Param("offset") int offset);


    @Select("""
            SELECT COUNT(*)
            FROM diaryComment
            """)
    int countAllComments();
}
