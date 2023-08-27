export const getPatient = /* GraphQL */ `
  query GetPatient($id: ID!) {
    getPatient(id: $id) {
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
export const listPatients = /* GraphQL */ `
  query ListPatients(
    $filter: ModelPatientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        name
        birth
        phone
        scripts {
          nextToken
          __typename
        }
        diagnoses {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getScript = /* GraphQL */ `
  query GetScript($id: ID!) {
    getScript(id: $id) {
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
export const listScripts = /* GraphQL */ `
  query ListScripts(
    $filter: ModelScriptFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listScripts(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const scriptsByPatientIDAndScript = /* GraphQL */ `
  query ScriptsByPatientIDAndScript(
    $patientID: ID!
    $script: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelScriptFilterInput
    $limit: Int
    $nextToken: String
  ) {
    scriptsByPatientIDAndScript(
      patientID: $patientID
      script: $script
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
export const getDiagnosis = /* GraphQL */ `
  query GetDiagnosis($id: ID!) {
    getDiagnosis(id: $id) {
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
export const listDiagnoses = /* GraphQL */ `
  query ListDiagnoses(
    $filter: ModelDiagnosisFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDiagnoses(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const diagnosesByPatientIDAndDiagnosis = /* GraphQL */ `
  query DiagnosesByPatientIDAndDiagnosis(
    $patientID: ID!
    $diagnosis: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDiagnosisFilterInput
    $limit: Int
    $nextToken: String
  ) {
    diagnosesByPatientIDAndDiagnosis(
      patientID: $patientID
      diagnosis: $diagnosis
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
