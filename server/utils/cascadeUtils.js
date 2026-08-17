/**
 * Performs cascade deletions or unsets across multiple models.
 * @param {string|Object} entityId - The ID of the entity being deleted.
 * @param {Array<{model: any, field: string, action: 'delete'|'unset'}>} mappings - Mapping of related models.
 * @returns {Promise<any[]>} - Results of all operations.
 */
export const performCascadeDelete = async (entityId, mappings) => {
  if (!entityId || !mappings) return [];

  const id = entityId._id ? entityId._id.toString() : entityId.toString();

  const operations = mappings.map(async (mapping) => {
    const { model, field, action } = mapping;

    if (action === 'delete') {
      return model.deleteMany({ [field]: id });
    } else if (action === 'unset') {
      return model.updateMany({ [field]: id }, { $unset: { [field]: "" } });
    } else if (action === 'set') {
      return model.updateMany({ [field]: id }, { $set: { [field]: null } });
    }

    return null;
  });

  return Promise.all(operations);
};
