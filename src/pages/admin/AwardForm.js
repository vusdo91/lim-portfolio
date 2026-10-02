import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
import AdminPageHeader from './AdminPageHeader';
import useUnsavedChanges from '../../hooks/useUnsavedChanges';
import { DEFAULT_AWARD_ITEMS } from '../../utils/profileDefaults';

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

const emptyAward = { year: '', content: '', content_en: '' };

const AwardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profile, updateAwardItems } = useProfile();
  const isEdit = Boolean(id);
  const awards = profile.awardItems || DEFAULT_AWARD_ITEMS;
  const existingAward = isEdit
    ? awards.find(award => String(award.id) === String(id))
    : null;
  const [formData, setFormData] = useState(emptyAward);
  const [initialData, setInitialData] = useState(emptyAward);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);
  const { confirmNavigation, markSaved } = useUnsavedChanges(isDirty);

  useEffect(() => {
    const nextData = existingAward
      ? {
        id: existingAward.id,
        year: existingAward.year || '',
        content: existingAward.content || '',
        content_en: existingAward.content_en || ''
      }
      : emptyAward;
    setFormData(nextData);
    setInitialData(nextData);
  }, [id, existingAward]);

  const updateField = (field, value) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const handleCancel = () => {
    if (confirmNavigation()) navigate('/admin/profile');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const savedAward = {
        ...formData,
        id: isEdit ? existingAward?.id ?? id : `award-${Date.now()}`
      };
      const nextAwards = isEdit
        ? awards.map(award => String(award.id) === String(id) ? savedAward : award)
        : [...awards, savedAward];
      const result = await updateAwardItems(nextAwards);
      if (!result.success) {
        setError(`저장에 실패했습니다: ${result.error}`);
        return;
      }
      markSaved();
      navigate('/admin/profile');
    } catch (saveError) {
      console.error('선정 항목 저장 중 오류:', saveError);
      setError('선정 항목 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? '선정 수정' : '선정 추가'}
        backTo="/admin/profile"
        onBack={handleCancel}
      />
      <Content>
        <Form onSubmit={handleSubmit}>
          <Field>
            연도
            <Input
              aria-label="선정 연도"
              value={formData.year}
              onChange={event => updateField('year', event.target.value)}
            />
          </Field>
          <Field>
            선정 내용 (한국어)
            <Input
              aria-label="선정 내용 (한국어)"
              value={formData.content}
              onChange={event => updateField('content', event.target.value)}
            />
          </Field>
          <Field>
            선정 내용 (English)
            <Input
              aria-label="선정 내용 (English)"
              value={formData.content_en}
              onChange={event => updateField('content_en', event.target.value)}
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

export default AwardForm;
