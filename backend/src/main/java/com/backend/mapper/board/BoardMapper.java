package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board(title,content,writer)
            VALUES (#{title},#{content},#{writer})
                        """)
    int insert(Board board);

    @Select("""
            SELECT * FROM board 
            ORDER BY id DESC
            """)
    List<Board> selectAll();
}
