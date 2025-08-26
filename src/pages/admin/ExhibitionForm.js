import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    border-color: #6D8142;
    box-shadow: 0 0 0 2px rgba(50, 67, 13, 0.1);
  }
  
  &.error {
    border-color: #dc3545;
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
    border-color: #6D8142;
    box-shadow: 0 0 0 2px rgba(50, 67, 13, 0.1);
  }
  
  &.error {
    border-color: #dc3545;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
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

const ExhibitionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addExhibition, updateExhibition, getExhibitionById } = useProfile();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'solo',
    year: new Date().getFullYear().toString(),
    name: '',
    name_en: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 연도 옵션 생성 (현재 연도부터 1990년까지)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= 1990; year--) {
    yearOptions.push(year.toString());
  }

  useEffect(() => {
    if (isEdit && id) {
      const exhibition = getExhibitionById(parseInt(id));
      if (exhibition) {
        setFormData({
          type: exhibition.type || 'solo',
          year: exhibition.year || currentYear.toString(),
          name: exhibition.name || '',
          name_en: exhibition.name_en || ''
        });
      }
    }
  }, [isEdit, id, getExhibitionById, currentYear]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
        updateExhibition(parseInt(id), exhibitionData);
      } else {
        addExhibition(exhibitionData);
      }

      navigate('/admin/profile');
    } catch (error) {
      console.error('전시 정보 저장 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/profile');
  };

  return (
    <Container>
      <Header>
        <Title>{isEdit ? '전시 수정' : '전시 추가'}</Title>
        <BackButton onClick={handleCancel}>
          프로필 관리로 돌아가기
        </BackButton>
      </Header>
      
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
        </Form>
      </Content>
    </Container>
  );
};

export default ExhibitionForm;