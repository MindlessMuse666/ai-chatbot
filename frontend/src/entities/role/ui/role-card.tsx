import { Card } from '@heroui/react'

const RoleCard = ({ role }: { role: string }) => {
  return (
    <Card className="w-full p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="">{role}</h3>
        </div>
      </div>
    </Card>
  )
}

export default RoleCard

