import { useCallback, useState } from 'react'

/** {@link useForm} 이 반환하는 값과 조작 함수들. */
export interface UseFormReturn<T> {
  /** 현재 폼 값. */
  values: T
  /** 특정 필드 하나를 갱신합니다. */
  setField: <K extends keyof T>(name: K, value: T[K]) => void
  /** 폼 전체를 초기값으로 되돌립니다. */
  reset: () => void
}

/**
 * 폼 상태를 관리하는 범용 커스텀 훅.
 * 여러 신청/등록 폼(자산등록·수리요청 등)에서 재사용해
 * 동일한 상태 관리 코드가 중복되지 않도록 분리했습니다.
 *
 * @typeParam T - 폼 값 객체 타입
 * @param initialValues - 초기 폼 값
 * @returns 현재 값과 갱신/초기화 함수 ({@link UseFormReturn})
 */
export function useForm<T extends object>(initialValues: T): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)

  // useCallback으로 감싸 참조를 고정 → 자식 컴포넌트 불필요한 리렌더 방지.
  // 인터페이스는 인덱스 시그니처가 없어 spread 결과 추론이 넓어지므로 T로 단언합니다.
  const setField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }) as T)
  }, [])

  const reset = useCallback(() => setValues(initialValues), [initialValues])

  return { values, setField, reset }
}
