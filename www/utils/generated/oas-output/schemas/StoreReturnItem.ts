/**
 * @schema StoreReturnItem
 * type: object
 * description: The item's items.
 * x-schemaName: StoreReturnItem
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The item's ID.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   received_quantity:
 *     type: number
 *     title: received_quantity
 *     description: The item's received quantity.
 *   damaged_quantity:
 *     type: number
 *     title: damaged_quantity
 *     description: The item's damaged quantity.
 *   reason_id:
 *     type: string
 *     title: reason_id
 *     description: The item's reason id.
 *   note:
 *     type: string
 *     title: note
 *     description: The item's note.
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The item's item id.
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The item's return id.
 *   metadata:
 *     type: object
 *     description: The item's metadata.
 * required:
 *   - id
 *   - quantity
 *   - received_quantity
 *   - damaged_quantity
 *   - item_id
 *   - return_id
 * 
*/
