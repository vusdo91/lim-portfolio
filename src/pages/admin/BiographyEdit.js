import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #5a6268;
  }
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.6;
  min-height: 400px;
  resize: vertical;
  font-family: 'Noto Sans KR', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #6D8142;
    box-shadow: 0 0 0 2px rgba(50, 67, 13, 0.1);
  }
`;

const CharCount = styled.div`
  text-align: right;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &.primary {
    background: #6D8142;
    color: white;
    
    &:hover:not(:disabled) {
      background: #2a3a0b;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
`;

const PreviewSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
`;

const PreviewTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const PreviewContent = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
`;

const BiographyEdit = () => {
  const navigate = useNavigate();
  const { profile, updateBiography } = useProfile();
  const [biography, setBiography] = useState(profile.biography || '');
  const [biographyEn, setBiographyEn] = useState(profile.biography_en || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate('/admin/profile');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      updateBiography(biography, biographyEn);
      navigate('/admin/profile');
    } catch (error) {
      console.error('소개문 저장 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (biography !== profile.biography || biographyEn !== profile.biography_en) {
      if (window.confirm('변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
        navigate('/admin/profile');
      }
    } else {
      navigate('/admin/profile');
    }
  };

  return (
    <Container>
      <Header>
        <Title>작가 소개문 편집</Title>
        <BackButton onClick={handleBack}>
          프로필 관리로 돌아가기
        </BackButton>
      </Header>
      
      <Content>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="biography">작가 소개문 (한국어)</Label>
            <TextArea
              id="biography"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="작가의 소개문을 작성해주세요..."
            />
            <CharCount>
              {biography.length.toLocaleString()}자
            </CharCount>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="biographyEn">작가 소개문 (English)</Label>
            <TextArea
              id="biographyEn"
              value={biographyEn}
              onChange={(e) => setBiographyEn(e.target.value)}
              placeholder="Please write the artist's biography in English..."
            />
            <CharCount>
              {biographyEn.length.toLocaleString()} characters
            </CharCount>
          </FormGroup>

          <FormActions>
            <Button 
              type="submit" 
              className="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </Button>
            <Button 
              type="button" 
              className="secondary" 
              onClick={handleCancel}
            >
              취소
            </Button>
          </FormActions>
        </Form>

        {/* 미리보기 섹션 */}
        {(biography || biographyEn) && (
          <PreviewSection>
            {biography && (
              <div style={{ marginBottom: biographyEn ? '2rem' : '0' }}>
                <PreviewTitle>미리보기 (한국어)</PreviewTitle>
                <PreviewContent>
                  {biography}
                </PreviewContent>
              </div>
            )}
            {biographyEn && (
              <div>
                <PreviewTitle>Preview (English)</PreviewTitle>
                <PreviewContent>
                  {biographyEn}
                </PreviewContent>
              </div>
            )}
          </PreviewSection>
        )}
      </Content>
    </Container>
  );
};

export default BiographyEdit;