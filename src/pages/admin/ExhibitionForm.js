import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
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
  max-width: 800px;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #2d2d2d;
    box-shadow: 0 0 0 2px rgba(45, 45, 45, 0.1);
  }
  
  &.error {
    border-color: #2d2d2d;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2d2d2d;
    box-shadow: 0 0 0 2px rgba(45, 45, 45, 0.1);
  }
  
  &.error {
    border-color: #2d2d2d;
  }
`;

const ErrorMessage = styled.div`
  color: #2d2d2d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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

const ExhibitionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profile, addExhibition, updateExhibition } = useProfile();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'solo',
    year: new Date().getFullYear().toString(),
    name: '',
    name_en: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveError, setSaveError] = useState('');
  const { confirmNavigation, markSaved } = useUnsavedChanges(hasUnsavedChanges);

  // 연도 옵션 생성 (현재 연도부터 1990년까지)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= 1990; year--) {
    yearOptions.push(year.toString());
  }

  useEffect(() => {
    if (isEdit && id) {
      const exhibition = profile.exhibitions.find(item => item.id === parseInt(id));
      if (exhibition) {
        setFormData({
          type: exhibition.type || 'solo',
          year: exhibition.year || currentYear.toString(),
          name: exhibition.name || '',
          name_en: exhibition.name_en || ''
        });
      }
    }
  }, [isEdit, id, profile.exhibitions, currentYear]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = '전시 구분을 선택해주세요.';
    }

    if (!formData.year) {
      newErrors.year = '연도를 선택해주세요.';
    }

    if (!formData.name.trim()) {
      newErrors.name = '전시명을 입력해주세요.';
    }

    if (!formData.name_en.trim()) {
      newErrors.name_en = '영문 전시명을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const exhibitionData = {
        type: formData.type,
        year: formData.year,
        name: formData.name.trim(),
        name_en: formData.name_en.trim()
      };

      if (isEdit) {
        const result = await updateExhibition(parseInt(id), exhibitionData);
        if (!result.success) {
          setSaveError(`저장에 실패했습니다: ${result.error}`);
          return;
        }
      } else {
        const result = await addExhibition(exhibitionData);
        if (!result.success) {
          setSaveError(`저장에 실패했습니다: ${result.error}`);
          return;
        }
      }

      markSaved();
      navigate('/admin/profile');
    } catch (error) {
      console.error('전시 정보 저장 중 오류:', error);
      setSaveError('전시 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirmNavigation()) navigate('/admin/profile');
  };

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? '전시 수정' : '전시 추가'}
        backTo="/admin/profile"
        onBack={handleCancel}
      />
      
      <Content>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="type">전시 구분</Label>
            <Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={errors.type ? 'error' : ''}
            >
              <option value="solo">개인전</option>
              <option value="group">그룹전</option>
            </Select>
            {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="year">연도</Label>
            <Select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={errors.year ? 'error' : ''}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            {errors.year && <ErrorMessage>{errors.year}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="name">전시명 (한국어)</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="전시명을 입력하세요 (예: 양탄자 무늬, 갤러리 그리다, 서울)"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="name_en">전시명 (English)</Label>
            <Input
              id="name_en"
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleInputChange}
              className={errors.name_en ? 'error' : ''}
              placeholder="Enter exhibition name in English (e.g., Carpet Pattern, Gallery Grida, Seoul)"
            />
            {errors.name_en && <ErrorMessage>{errors.name_en}</ErrorMessage>}
          </FormGroup>

          <FormActions>
            <Button 
              type="submit" 
              className="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : (isEdit ? '수정하기' : '추가하기')}
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
      </Content>
    </Container>
  );
};

export default ExhibitionForm;