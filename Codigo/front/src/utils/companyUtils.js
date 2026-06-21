export const getCompanyName = (company) => {
  return company?.nome || company?.nomeFantasia || company?.name || '';
};

export const getCompanyDisplayName = (companies, companyId) => {
  if (!companyId) {
    const defaultCompany = companies.find(company => company.sistema === true)
      || companies.find(company => company.tipo === 'MATRIZ')
      || companies[0];

    if (!defaultCompany) {
      return '-';
    }

    return `${getCompanyName(defaultCompany)} (${defaultCompany.tipo === 'FILIAL' ? 'Filial' : 'Matriz'})`;
  }

  const company = companies.find(item => Number(item.id) === Number(companyId));

  if (!company) {
    return '-';
  }

  return `${getCompanyName(company)} (${company.tipo === 'FILIAL' ? 'Filial' : 'Matriz'})`;
};

export const getRecordCompanyId = (record, products = []) => {
  if (record?.companyId) {
    return record.companyId;
  }

  const product = products.find(item => Number(item.id) === Number(record?.productId));

  return product?.companyId || null;
};

export const getDefaultCompanyId = (companies) => {
  const defaultCompany = companies.find(company => company.sistema === true)
    || companies.find(company => company.tipo === 'MATRIZ')
    || companies[0];

  return defaultCompany?.id ? String(defaultCompany.id) : '';
};
