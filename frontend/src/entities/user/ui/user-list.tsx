'use client'

import { useUserApi } from '../api/user'
import { UserCard } from './user-card'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { Spinner } from '@heroui/react'
import CustomScroll from '@/shared/ui/custom-scroll'

const UserList = () => {
  const { ref, inView } = useInView()
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading,
    error
  } = useUserApi.useInfiniteUsers()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    console.log('Data:', data)
    console.log('Error:', error)
    console.log('Is Loading:', isLoading)
  }, [data, error, isLoading])

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Ошибка при загрузке пользователей: {error.message}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!data?.pages?.[0]?.users?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Пользователи не найдены
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-12rem)] overflow-hidden">
      <CustomScroll className="h-full px-4">
        <div className="space-y-4">
          {data.pages.map((page, i) => (
            <div key={i} className="space-y-4">
              {page.users.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ))}
          {hasNextPage && (
            <div ref={ref} className="flex justify-center p-4">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      </CustomScroll>
    </div>
  )
}   

export default UserList