const signUpConfig = {
  header: 'Create an [AI MEDICO] Account',
  defaultCountryCode: '82',
  signUpFields: [

    {
      label: 'Contact Name',
      key: 'family_name',
      required: true,
      displayOrder: 101,
      type: 'string'
    },
      {
      label: 'Hospital name',
      key: 'given_name',
      required: true,
      displayOrder: 100,
      type: 'string'
    },
    {
      label: 'Address',
      key: 'address',
      required: true,
      displayOrder: 102,
      type: 'string'
    }
  ]
};

export default signUpConfig
