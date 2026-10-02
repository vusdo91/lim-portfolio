import { useCallback, useEffect, useRef } from 'react';

export const UNSAVED_CHANGES_MESSAGE = '수정한 내용이 저장되지 않았습니다. 페이지를 이동하시겠습니까?';

const useUnsavedChanges = isDirty => {
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  useEffect(() => {
    if (!isDirty) return undefined;
    const handleBeforeUnload = event => {
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const confirmNavigation = useCallback(() => (
    !isDirtyRef.current || window.confirm(UNSAVED_CHANGES_MESSAGE)
  ), []);

  const markSaved = useCallback(() => {
    isDirtyRef.current = false;
  }, []);

  return { confirmNavigation, markSaved };
};

export default useUnsavedChanges;
