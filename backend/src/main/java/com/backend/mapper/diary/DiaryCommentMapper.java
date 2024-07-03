package com.backend.mapper.diary;

import com.backend.domain.diary.DiaryComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DiaryCommentMapper {

    @Insert("""
            INSERT INTO diary_comment
            (member_id, comment, nickname)
            VALUES (#{memberId}, #{comment}, #{nickname})
            """)
    public int diaryCommentInsert(DiaryComment diaryComment);

    @Select("""
            SELECT
                c.id,
                c.comment,
                c.inserted,
                c.member_id,
                m.nickname
                FROM diary_comment c JOIN member m ON c.member_id = m.id
                ORDER BY c.id DESC
            """)
    List<DiaryComment> selectByDiaryId();

    @Delete("""
            DELETE FROM diary_comment
            WHERE id = #{id}
            """)
    int deleteById(Integer id);

    @Select("""
                SELECT *
                FROM diary_comment
                WHERE id = #{id}
            """)
    DiaryComment selectById(Integer id);

    @Update("""
                UPDATE diary_comment
                SET comment = #{comment}
                WHERE id = #{id}
            """)
    int diaryUpdate(DiaryComment diaryComment);

    @Select("""
            SELECT *
            FROM diary_comment
            WHERE id = #{id}
            """)
    int selectgetById(Integer id);

    @Select("""
            SELECT *
            FROM diary_comment
            ORDER BY inserted DESC
            LIMIT #{limit} OFFSET #{offset}
            """)
    List<DiaryComment> selectAll(@Param("limit") int limit, @Param("offset") int offset);

    @Select("""
            SELECT COUNT(*)
            FROM diary_comment
            """)
    int countAllComments();
}
