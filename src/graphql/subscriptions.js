export const onCreatePatient = /* GraphQL */ `
  subscription OnCreatePatient(
    $filter: ModelSubscriptionPatientFilterInput
    $owner: String
  ) {
    onCreatePatient(filter: $filter, owner: $owner) {
      id
      email
      name
      birth
      phone
      scripts {
        items {
          id
          email
          name
          patientID
          script
          scripteng
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
          name
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
export const onUpdatePatient = /* GraphQL */ `
  subscription OnUpdatePatient(
    $filter: ModelSubscriptionPatientFilterInput
    $owner: String
  ) {
    onUpdatePatient(filter: $filter, owner: $owner) {
      id
      email
      name
      birth
      phone
      scripts {
        items {
          id
          email
          name
          patientID
          script
          scripteng
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
          name
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
export const onDeletePatient = /* GraphQL */ `
  subscription OnDeletePatient(
    $filter: ModelSubscriptionPatientFilterInput
    $owner: String
  ) {
    onDeletePatient(filter: $filter, owner: $owner) {
      id
      email
      name
      birth
      phone
      scripts {
        items {
          id
          email
          name
          patientID
          script
          scripteng
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
          name
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
export const onCreateScript = /* GraphQL */ `
  subscription OnCreateScript(
    $filter: ModelSubscriptionScriptFilterInput
    $owner: String
  ) {
    onCreateScript(filter: $filter, owner: $owner) {
      id
      email
      name
      patientID
      script
      scripteng
      summary
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateScript = /* GraphQL */ `
  subscription OnUpdateScript(
    $filter: ModelSubscriptionScriptFilterInput
    $owner: String
  ) {
    onUpdateScript(filter: $filter, owner: $owner) {
      id
      email
      name
      patientID
      script
      scripteng
      summary
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteScript = /* GraphQL */ `
  subscription OnDeleteScript(
    $filter: ModelSubscriptionScriptFilterInput
    $owner: String
  ) {
    onDeleteScript(filter: $filter, owner: $owner) {
      id
      email
      name
      patientID
      script
      scripteng
      summary
      date
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateDiagnosis = /* GraphQL */ `
  subscription OnCreateDiagnosis(
    $filter: ModelSubscriptionDiagnosisFilterInput
    $owner: String
  ) {
    onCreateDiagnosis(filter: $filter, owner: $owner) {
      id
      email
      name
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
export const onUpdateDiagnosis = /* GraphQL */ `
  subscription OnUpdateDiagnosis(
    $filter: ModelSubscriptionDiagnosisFilterInput
    $owner: String
  ) {
    onUpdateDiagnosis(filter: $filter, owner: $owner) {
      id
      email
      name
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
export const onDeleteDiagnosis = /* GraphQL */ `
  subscription OnDeleteDiagnosis(
    $filter: ModelSubscriptionDiagnosisFilterInput
    $owner: String
  ) {
    onDeleteDiagnosis(filter: $filter, owner: $owner) {
      id
      email
      name
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
