/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const SORT_ORDER_ASC = 0;
const SORT_ORDER_DESC = 1;
const SORT_FIELD_ID = 'id';
const SORT_FIELD_PRODUCT = 'product';
const SORT_FIELD_CATEGORY = 'category';
const SORT_FIELD_USER = 'user';

const FilterBar = (
  { users,
    selectedUser,
    filterByUser,
    filterByQuery,
    categories,
    selectedCategories,
    filterByCategories,
    sortBy,
    setSortOrder },
) => {
  function resetQueryInputValue() {
    document.getElementById('queryInput').value = '';
  }

  function resetFilters() {
    filterByQuery(null);
    resetQueryInputValue();
    filterByUser(null);
    filterByCategories([]);
    sortBy(null);
    setSortOrder(null);
  }

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            data-cy="FilterAllUsers"
            href="#/"
            className={cn({
              'is-active': !selectedUser,
            })}
            onClick={() => filterByUser(null)}
          >
            All
          </a>

          {users.map(user => (
            <a
              data-cy="FilterUser"
              href="#/"
              className={cn({
                'is-active': selectedUser
                  ? selectedUser.name === user.name
                  : false,
              })}
              key={user.id}
              onClick={() => filterByUser(user)}
            >
              {user.name}
            </a>
          ))}
        </p>

        <div className="panel-block">
          <p className="control has-icons-left has-icons-right">
            <input
              id="queryInput"
              data-cy="SearchField"
              type="text"
              className="input"
              placeholder="Search"
              onChange={event => filterByQuery(event.target.value)}
            />

            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true" />
            </span>

            <span className="icon is-right">
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              {(document.getElementById('queryInput')
                ? document.getElementById('queryInput').value.length !== 0
                : false)
                && (
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => {
                      resetQueryInputValue();
                      filterByQuery(null);
                    }}
                  />
                )}
            </span>
          </p>
        </div>

        <div className="panel-block is-flex-wrap-wrap">
          <a
            href="#/"
            data-cy="AllCategories"
            className={cn('button', 'is-success', 'mr-6', {
              'is-outlined': selectedCategories.length !== 0,
            })}
            onClick={() => filterByCategories([])}
          >
            All
          </a>

          {categories.map(({ title, id }) => (
            <a
              data-cy="Category"
              className={cn('button', 'mr-2', 'my-1', {
                'is-info': selectedCategories.includes(title),
              })}
              href="#/"
              key={id}
              onClick={() => {
                if (!selectedCategories.includes(title)) {
                  return filterByCategories(selectedCategories.concat([title]));
                }

                const newArr = [...selectedCategories];

                newArr.splice(newArr.indexOf(title), 1);

                return filterByCategories(newArr);
              }}
            >
              {title}
            </a>
          ))}
        </div>

        <div className="panel-block">
          <a
            data-cy="ResetAllButton"
            href="#/"
            className="button is-link is-outlined is-fullwidth"
            onClick={() => resetFilters()}
          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
};

const ProductInfo = ({ product }) => {
  const {
    id,
    name,
    category,
    user,
  } = product;

  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">{name}</td>
      <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

      <td
        data-cy="ProductUser"
        className={user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}
      >
        {user.name}
      </td>
    </tr>
  );
};

const Table = ({
  productsList,
  sortBy,
  sortField,
  setSortOrder,
  sortOrder,
}) => {
  function changeSortOrder(sortFieldToChange) {
    if (sortFieldToChange !== sortField) {
      sortBy(sortFieldToChange);
      setSortOrder(SORT_ORDER_ASC);
    } else if (sortOrder === SORT_ORDER_DESC) {
      setSortOrder(null);
      sortBy(null);
    } else {
      setSortOrder(sortOrder + 1);
    }
  }

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              ID

              <a
                href="#/"
                onClick={() => changeSortOrder(SORT_FIELD_ID)}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas', {
                      'fa-sort-up': sortField === SORT_FIELD_ID
                        && sortOrder === SORT_ORDER_ASC,
                      'fa-sort-down': sortField === SORT_FIELD_ID
                        && sortOrder === SORT_ORDER_DESC,
                      'fa-sort': sortField !== SORT_FIELD_ID,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Product

              <a
                href="#/"
                onClick={() => changeSortOrder(SORT_FIELD_PRODUCT)}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas', {
                      'fa-sort-up': sortField === SORT_FIELD_PRODUCT
                        && sortOrder === SORT_ORDER_ASC,
                      'fa-sort-down': sortField === SORT_FIELD_PRODUCT
                        && sortOrder === SORT_ORDER_DESC,
                      'fa-sort': sortField !== SORT_FIELD_PRODUCT,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Category

              <a
                href="#/"
                onClick={() => changeSortOrder(SORT_FIELD_CATEGORY)}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas', {
                      'fa-sort-up': sortField === SORT_FIELD_CATEGORY
                        && sortOrder === SORT_ORDER_ASC,
                      'fa-sort-down': sortField === SORT_FIELD_CATEGORY
                        && sortOrder === SORT_ORDER_DESC,
                      'fa-sort': sortField !== SORT_FIELD_CATEGORY,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              User

              <a
                href="#/"
                onClick={() => changeSortOrder(SORT_FIELD_USER)}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas', {
                      'fa-sort-up': sortField === SORT_FIELD_USER
                        && sortOrder === SORT_ORDER_ASC,
                      'fa-sort-down': sortField === SORT_FIELD_USER
                        && sortOrder === SORT_ORDER_DESC,
                      'fa-sort': sortField !== SORT_FIELD_USER,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {productsList
          .map(product => <ProductInfo product={product} key={product.id} />)}
      </tbody>
    </table>
  );
};

function findCategoryById(categoryId) {
  return categoriesFromServer.find(({ id }) => id === categoryId);
}

function findUserById(userId) {
  return usersFromServer.find(({ id }) => id === userId);
}

function prepareProducts(selectedUser,
  query,
  selectedCategories,
  sortField,
  sortOrder) {
  let products = productsFromServer.map((product) => {
    const category = findCategoryById(product.categoryId); // find by product.categoryId
    const user = findUserById(category.ownerId); // find by category.ownerId

    return {
      ...product,
      category,
      user,
    };
  });

  if (selectedUser) {
    products = products.filter(({ user }) => user.name === selectedUser.name);
  }

  if (query) {
    const normalizedQuery = query.toLowerCase().trim();

    products = products
      .filter(({ name }) => name.toLowerCase().includes(normalizedQuery));
  }

  if (selectedCategories.length !== 0) {
    products = products.filter(({ category }) =>
      selectedCategories.includes(category.title));
  }

  if (sortField !== null) {
    products.sort((product1, product2) => {
      switch (sortField) {
        case SORT_FIELD_CATEGORY:
          return product1.category.title
            .localeCompare(product2.category.title);
        case SORT_FIELD_ID:
          return product1.id - product2.id;
        case SORT_FIELD_PRODUCT:
          return product1.name.localeCompare(product2.name);
        case SORT_FIELD_USER:
          return product1.user.name.localeCompare(product2.user.name);
        default: return -1;
      }
    });

    if (sortOrder === SORT_ORDER_DESC) {
      products.reverse();
    }
  }

  return products.length === 0 ? null : products;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setsortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);

  const visibleProducts = prepareProducts(selectedUser,
    query,
    selectedCategories,
    sortField,
    sortOrder);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <FilterBar
          users={usersFromServer}
          filterByUser={setSelectedUser}
          selectedUser={selectedUser}
          filterByQuery={setQuery}
          categories={categoriesFromServer}
          selectedCategories={selectedCategories}
          filterByCategories={setSelectedCategories}
          sortBy={setSortField}
          setSortOrder={setsortOrder}
        />

        {visibleProducts
          ? (
            <Table
              productsList={visibleProducts}
              setSortOrder={setsortOrder}
              sortField={sortField}
              sortBy={setSortField}
              sortOrder={sortOrder}
            />
          )
          : (
            <div className="box table-container">
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>

            </div>
          )
        }

      </div>
    </div>
  );
};
