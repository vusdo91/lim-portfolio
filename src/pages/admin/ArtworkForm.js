import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useArtworks } from '../../contexts/ArtworkContext';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  overflow-y: auto;
  height: 100vh;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6D8142;
    box-shadow: 0 0 0 2px rgba(50, 67, 13, 0.1);
  }
  
  &.error {
    border-color: #dc3545;
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6D8142;
  }
  
  &.error {
    border-color: #dc3545;
  }
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  
  img {
    max-width: 300px;
    max-height: 200px;
    object-fit: contain;
    border: 1px solid #ddd;
    border-radius: 4px;
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

const ArtworkForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addArtwork, updateArtwork, getArtworkById } = useArtworks();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    size: '',
    material: '',
    year: '',
    description: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const artwork = getArtworkById(parseInt(id));
      if (artwork) {
        setFormData({
          title: artwork.title || '',
          size: artwork.size || '',
          material: artwork.material || '',
          year: artwork.year || '',
          description: artwork.description || '',
          image: artwork.image || ''
        });
        setImagePreview(artwork.image || '');
      }
    }
  }, [isEdit, id, getArtworkById]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 확인 (3MB = 3 * 1024 * 1024 bytes)
      if (file.size > 3 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: '이미지 파일 크기는 3MB 이하여야 합니다.'
        }));
        return;
      }

      setImageFile(file);
      
      // 이미지 미리보기
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
      
      // 에러 메시지 제거
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '작품 이름을 입력해주세요.';
    }

    if (!formData.size.trim()) {
      newErrors.size = '작품 크기를 입력해주세요.';
    }

    if (!formData.material.trim()) {
      newErrors.material = '제작 도구/재료를 입력해주세요.';
    }

    if (!formData.year.trim()) {
      newErrors.year = '제작 연도를 입력해주세요.';
    }

    if (!isEdit && !formData.image) {
      newErrors.image = '작품 이미지를 선택해주세요.';
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
      const artworkData = {
        title: formData.title.trim(),
        size: formData.size.trim(),
        material: formData.material.trim(),
        year: formData.year.trim(),
        description: formData.description.trim(),
        image: formData.image
      };

      if (isEdit) {
        updateArtwork(parseInt(id), artworkData);
      } else {
        addArtwork(artworkData);
      }

      navigate('/admin/artwork');
    } catch (error) {
      console.error('작품 저장 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/artwork');
  };

  return (
    <Container>
      <Header>
        <Title>{isEdit ? '작품 수정' : '작품 추가'}</Title>
        <BackButton onClick={handleCancel}>
          목록으로 돌아가기
        </BackButton>
      </Header>
      
      <Content>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="image">작품 이미지 (3MB 이하)</Label>
            <FileInput
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={errors.image ? 'error' : ''}
            />
            {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
            {imagePreview && (
              <ImagePreview>
                <img src={imagePreview} alt="미리보기" />
              </ImagePreview>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="title">작품 이름</Label>
            <Input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? 'error' : ''}
              placeholder="작품 이름을 입력하세요"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="size">작품 크기</Label>
            <Input
              id="size"
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className={errors.size ? 'error' : ''}
              placeholder="예: 100 x 80 cm"
            />
            {errors.size && <ErrorMessage>{errors.size}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="material">제작 도구/재료</Label>
            <Input
              id="material"
              type="text"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              className={errors.material ? 'error' : ''}
              placeholder="예: Oil on canvas"
            />
            {errors.material && <ErrorMessage>{errors.material}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="year">제작 연도</Label>
            <Input
              id="year"
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={errors.year ? 'error' : ''}
              placeholder="예: 2024"
            />
            {errors.year && <ErrorMessage>{errors.year}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">작품 설명 (선택사항)</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="작품에 대한 설명을 입력하세요"
            />
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

export default ArtworkForm;