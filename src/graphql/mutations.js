/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPatient = /* GraphQL */ `
  mutation CreatePatient(
    $input: CreatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    createPatient(input: $input, condition: $condition) {
      id
      email
      name
      birth
      phone
      scripts {
        items {
          id
          email
          patientID
          script
          summary
          date
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      diagnoses {
        items {
          id
          email
          patientID
          diagnosis
          date
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePatient = /* GraphQL */ `
  mutation UpdatePatient(
    $input: UpdatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    updatePatient(input: $input, condition: $condition) {
      id
      email
      name
      birth
      phone
      scripts {
        items {
          id
          email
          patientID
          script
          summary
          date
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      diagnoses {
        items {
          id
          email
          patientID
          diagnosis
          date
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePatient = /* GraphQL */ `
  mutation DeletePatient(
    $input: DeletePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    deletePatient(input: $input, condition: $condition) {
      id
      email
      name
      birth
      phone
      scripts {
        items {
          id
          email
          patientID
          script
          summary
          date
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      diagnoses {
        items {
          id
          email
          patientID
          diagnosis
          date
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createScript = /* GraphQL */ `
  mutation CreateScript(
    $input: CreateScriptInput!
    $condition: ModelScriptConditionInput
  ) {
    createScript(input: $input, condition: $condition) {
      id
      email
      patientID
      script
      summary
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateScript = /* GraphQL */ `
  mutation UpdateScript(
    $input: UpdateScriptInput!
    $condition: ModelScriptConditionInput
  ) {
    updateScript(input: $input, condition: $condition) {
      id
      email
      patientID
      script
      summary
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteScript = /* GraphQL */ `
  mutation DeleteScript(
    $input: DeleteScriptInput!
    $condition: ModelScriptConditionInput
  ) {
    deleteScript(input: $input, condition: $condition) {
      id
      email
      patientID
      script
      summary
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createDiagnosis = /* GraphQL */ `
  mutation CreateDiagnosis(
    $input: CreateDiagnosisInput!
    $condition: ModelDiagnosisConditionInput
  ) {
    createDiagnosis(input: $input, condition: $condition) {
      id
      email
      patientID
      diagnosis
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateDiagnosis = /* GraphQL */ `
  mutation UpdateDiagnosis(
    $input: UpdateDiagnosisInput!
    $condition: ModelDiagnosisConditionInput
  ) {
    updateDiagnosis(input: $input, condition: $condition) {
      id
      email
      patientID
      diagnosis
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteDiagnosis = /* GraphQL */ `
  mutation DeleteDiagnosis(
    $input: DeleteDiagnosisInput!
    $condition: ModelDiagnosisConditionInput
  ) {
    deleteDiagnosis(input: $input, condition: $condition) {
      id
      email
      patientID
      diagnosis
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
