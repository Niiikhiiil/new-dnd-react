import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableItem = React.memo(({ id, product, onEdit, onDelete }) => {
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
            style={styles}
            {...attributes}
            {...listeners}
            className="w-full max-w-full border p-4 bg-white flex justify-between items-center shadow cursor-grab"
        >
            <div>
                <h2 className="font-bold">{product.title}</h2>
                <p className="text-sm">{product.description}</p>
            </div>
        </div>
    )
})


export default SortableItem
