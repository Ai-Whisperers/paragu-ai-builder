'use client'

interface StaffMember {
  name: string
  role?: string
  image?: string
  bio?: string
  specialties?: string[]
}

interface StaffSelectorProps {
  staff: StaffMember[]
  onSelect: (staff: StaffMember) => void
  selectedStaff?: StaffMember | null
}

export default function StaffSelector({
  staff,
  onSelect,
  selectedStaff
}: StaffSelectorProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">Selecciona un profesional (opcional)</h4>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onSelect(null as any)}
          className={`flex-shrink-0 px-4 py-2 rounded-full border transition-colors ${
            !selectedStaff 
              ? 'border-[var(--primary)] bg-[var(--primary)] text-white' 
              : 'border-gray-200 hover:border-[var(--primary)]'
          }`}
        >
          Cualquiera
        </button>
        {staff.map((member, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(member)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${
              selectedStaff?.name === member.name
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white' 
                : 'border-gray-200 hover:border-[var(--primary)]'
            }`}
          >
            {member.image ? (
              <img src={member.image} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs">{member.name.charAt(0)}</span>
              </div>
            )}
            <span className="text-sm">{member.name}</span>
          </button>
        ))}
      </div>

      {selectedStaff && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900">{selectedStaff.name}</p>
          {selectedStaff.role && <p className="text-sm text-gray-500">{selectedStaff.role}</p>}
          {selectedStaff.specialties && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {selectedStaff.specialties.map((spec, idx) => (
                <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">{spec}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}