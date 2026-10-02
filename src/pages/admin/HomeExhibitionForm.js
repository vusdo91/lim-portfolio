import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
import AdminPageHeader from './AdminPageHeader';
import useUnsavedChanges from '../../hooks/useUnsavedChanges';
import { DEFAULT_HOME_SETTINGS } from '../../utils/homeSettings';

const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background: #f5f5f5;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Field = styled.label`
  display: block;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font: inherit;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: 0;
  border-radius: 4px;
  background: ${props => props.$primary ? '#2d2d2d' : '#6c757d'};
  color: white;
  font: inherit;
  cursor: pointer;

  &:disabled {
    background: #888;
    cursor: wait;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 1rem;
  color: #b42318;
`;

const HomeExhibitionForm = () => {
  const navigate = useNavigate();
  const { profile, updateHomeSettings } = useProfile();
  const [formData, setFormData] = useState({
    exhibitionTitle: profile.homeExhibitionTitle ?? DEFAULT_HOME_SETTINGS.exhibitionTitle,
    exhibitionDate: profile.homeExhibitionDate ?? DEFAULT_HOME_SETTINGS.exhibitionDate,
    galleryName: profile.homeGalleryName ?? DEFAULT_HOME_SETTINGS.galleryName
  });
  const [initialData, setInitialData] = useState(formData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);
  const { confirmNavigation, markSaved } = useUnsavedChanges(isDirty);

  useEffect(() => {
    const nextData = {
      exhibitionTitle: profile.homeExhibitionTitle ?? DEFAULT_HOME_SETTINGS.exhibitionTitle,
      exhibitionDate: profile.homeExhibitionDate ?? DEFAULT_HOME_SETTINGS.exhibitionDate,
      galleryName: profile.homeGalleryName ?? DEFAULT_HOME_SETTINGS.galleryName
    };
    setFormData(nextData);
    setInitialData(nextData);
  }, [
    profile.homeExhibitionTitle,
    profile.homeExhibitionDate,
    profile.homeGalleryName
  ]);

  const updateField = (field, value) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const handleCancel = () => {
    if (confirmNavigation()) navigate('/admin/home');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const result = await updateHomeSettings(formData);
      if (!result.success) {
        setError(`저장에 실패했습니다: ${result.error}`);
        return;
      }
      markSaved();
      navigate('/admin/home');
    } catch (saveError) {
      console.error('홈 전시 정보 저장 중 오류:', saveError);
      setError('홈 전시 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <AdminPageHeader title="홈 전시정보 수정" backTo="/admin/home" onBack={handleCancel} />
      <Content>
        <Form onSubmit={handleSubmit}>
          <Field>
            전시 제목
            <Input
              aria-label="전시 제목"
              value={formData.exhibitionTitle}
              onChange={event => updateField('exhibitionTitle', event.target.value)}
            />
          </Field>
          <Field>
            전시 날짜 표기
            <Input
              aria-label="전시 날짜 표기"
              value={formData.exhibitionDate}
              onChange={event => updateField('exhibitionDate', event.target.value)}
            />
          </Field>
          <Field>
            갤러리·미술관 이름
            <Input
              aria-label="갤러리·미술관 이름"
              value={formData.galleryName}
              onChange={event => updateField('galleryName', event.target.value)}
            />
          </Field>
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
          <Actions>
            <Button type="submit" $primary disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장하기'}
            </Button>
            <Button type="button" onClick={handleCancel}>취소</Button>
          </Actions>
        </Form>
      </Content>
    </Container>
  );
};

export default HomeExhibitionForm;
