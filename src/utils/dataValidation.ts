// Basic property data validation and logging utility

export function validatePropertyData(propertyData: any, formValues: any) {
  // Example: Ensure required fields are present
  const requiredFields = [
    'propertyType', 'propertyName', 'location', 'roomCount', 'bathroomCount', 'basePrice', 'currency', 'title', 'description', 'highlights'
  ];
  const errors: string[] = [];
  requiredFields.forEach(field => {
    if (!propertyData[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  // Return the original data and errors for now
  return {
    ...propertyData,
    ...formValues,
    validationErrors: errors
  };
}

export function logValidationSummary(serializedData: any, _propertyData: any) {
  // Simple console log for debugging
  if (serializedData.validationErrors && serializedData.validationErrors.length > 0) {
    console.warn('Validation errors:', serializedData.validationErrors);
  } else {
    console.log('Property data validated successfully.');
  }
}
