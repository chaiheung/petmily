package com.backend.service.comment;

import com.backend.domain.comment.HospitalComment;
import com.backend.mapper.comment.HospitalCommentMapper;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class HospitalCommentService {
    final HospitalCommentMapper mapper;
    private final MemberMapper memberMapper;

    public void add(HospitalComment hospitalComment, Authentication authentication) {
        hospitalComment.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insert(hospitalComment);
    }

    public boolean validate(HospitalComment hospitalComment) {
        if (hospitalComment == null) {
            return false;
        }
        if (hospitalComment.getComment().isBlank()) {
            return false;
        }
        return true;
    }

    public List<HospitalComment> list(Integer hospitalId) {

        return mapper.selectByHospitalId(hospitalId);
    }

    public void remove(HospitalComment hospitalComment) {
        mapper.deleteById(hospitalComment.getId());
    }

    public boolean hasAccess(HospitalComment hospitalComment, Authentication authentication) {
        HospitalComment db = mapper.selectById(hospitalComment.getId());
        if (db == null) {
            return false;
        }

        if (authentication.getName().equals(db.getMemberId().toString())) {
            return false;
        }

        return true;
    }

    public void edit(HospitalComment hospitalComment) {
        mapper.update(hospitalComment);
    }
}

