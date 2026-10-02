import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
import { useArtworks } from '../../contexts/ArtworkContext';
import AdminPageHeader from './AdminPageHeader';
import useUnsavedChanges from '../../hooks/useUnsavedChanges';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  overflow-y: auto;
  height: 100vh;
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
const TextInput = styled.input`
  width: 100%;
  padding: .85rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font: inherit;
  &:focus { outline: 2px solid #2d2d2d; outline-offset: 2px; }
`;
const ArtworkSelect = styled.select`
  width: 100%;
  padding: .85rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font: inherit;
  &:focus { outline: 2px solid #2d2d2d; outline-offset: 2px; }
`;
const HelpText = styled.p`
  margin-top: .5rem;
  color: #666;
  font-size: .85rem;
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
    border-color: #2d2d2d;
    box-shadow: 0 0 0 2px rgba(45, 45, 45, 0.1);
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
    background: #2d2d2d;
    color: white;
    
    &:hover:not(:disabled) {
      background: #1a1a1a;
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
  background: #f5f5f5;
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
  const { artworks } = useArtworks();
  const [biography, setBiography] = useState(profile.biography || '');
  const [biographyEn, setBiographyEn] = useState(profile.biography_en || '');
  const [biographyTitle, setBiographyTitle] = useState(profile.biographyTitle || '');
  const [biographyTitleEn, setBiographyTitleEn] = useState(profile.biographyTitle_en || '');
  const [aboutArtworkId, setAboutArtworkId] = useState(profile.aboutArtworkId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');
  const hasUnsavedChanges = biography !== (profile.biography || '')
    || biographyEn !== (profile.biography_en || '')
    || biographyTitle !== (profile.biographyTitle || '')
    || biographyTitleEn !== (profile.biographyTitle_en || '')
    || aboutArtworkId !== (profile.aboutArtworkId || '');
  const { confirmNavigation, markSaved } = useUnsavedChanges(hasUnsavedChanges);
  useEffect(() => {
    setBiography(profile.biography || '');
    setBiographyEn(profile.biography_en || '');
    setBiographyTitle(profile.biographyTitle || '');
    setBiographyTitleEn(profile.biographyTitle_en || '');
    setAboutArtworkId(profile.aboutArtworkId || '');
  }, [profile.biography, profile.biography_en, profile.biographyTitle, profile.biographyTitle_en, profile.aboutArtworkId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateBiography(biography, biographyEn, {
        biographyTitle: biographyTitle.trim(),
        biographyTitle_en: biographyTitleEn.trim(),
        aboutArtworkId
      });
      if (result.success) {
        markSaved();
        navigate('/admin/profile');
      }
      else setSaveError('저장에 실패했습니다. 다시 시도해 주세요.');
    } catch (error) {
      console.error('소개문 저장 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirmNavigation()) navigate('/admin/profile');
  };

  return (
    <Container>
      <AdminPageHeader title="작가 소개문 편집" backTo="/admin/profile" onBack={handleCancel} />
      
      <Content>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="aboutArtwork">About 대표 작품</Label>
            <ArtworkSelect id="aboutArtwork" value={aboutArtworkId} onChange={event => setAboutArtworkId(event.target.value)}>
              <option value="">첫 번째 등록 작품 자동 표시</option>
              {artworks.filter(artwork => artwork.image && artwork.title).map(artwork =>
                <option key={artwork.id} value={String(artwork.id)}>{artwork.title} ({artwork.year || '연도 미입력'})</option>
              )}
            </ArtworkSelect>
            <HelpText>Works 관리자에서 등록한 작품 중 한 점을 선택하세요.</HelpText>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="biographyTitle">소개글 제목 (한국어)</Label>
            <TextInput id="biographyTitle" value={biographyTitle} onChange={event => setBiographyTitle(event.target.value)} placeholder="소개글 제목을 입력해 주세요" />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="biographyTitleEn">소개글 제목 (English)</Label>
            <TextInput id="biographyTitleEn" value={biographyTitleEn} onChange={event => setBiographyTitleEn(event.target.value)} placeholder="Enter the introduction title" />
          </FormGroup>
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
          {saveError && <p role="alert">{saveError}</p>}
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
