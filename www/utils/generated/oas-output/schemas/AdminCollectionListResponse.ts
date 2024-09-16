/**
 * @schema AdminCollectionListResponse
 * type: object
 * description: The paginated list of product collections.
 * x-schemaName: AdminCollectionListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - collections
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items returned.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the returned results.
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of items.
 *   collections:
 *     type: array
 *     description: The list of product collections.
 *     items:
 *       $ref: "#/components/schemas/AdminCollection"
 * 
*/
