import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableItem = React.memo(({ id, product, onEdit, setShowDeleteModal, setEditingId }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const styles = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={{ ...styles, touchAction: 'none' }}

            className="w-full max-w-full border p-4 bg-white flex justify-between items-center shadow cursor-grab"
        >
            <div {...attributes}
                {...listeners} >
                <h2 className="font-bold">{product.title}</h2>
                <p className="text-sm">{product.description}</p>
            </div>
            <div className="flex flex-col items-center sm:flex-row gap-4 ms-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit(product)
                    }}
                    className="text-amber-50 cursor-pointer bg-blue-700 p-2 px-4 rounded-lg z-auto"
                >
                    Edit
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setEditingId(product?.id)
                        setShowDeleteModal(true)
                    }}
                    className="text-amber-50 cursor-pointer bg-red-700 p-2 rounded-lg z-auto"
                >
                    Delete
                </button>
            </div>
        </div>
    )
})


export default SortableItem
