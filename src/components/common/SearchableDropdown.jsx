import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { FiChevronDown, FiX, FiCheck } from 'react-icons/fi';

const SearchableDropdown = ({
  options,
  label,
  placeholder = 'Search...',
  error,
  touched,
  required = false,
  onSelect,
  selectedValue,
}) => {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option?.label?.toLowerCase().includes(query.toLowerCase());
        });

  const clearSelection = () => {
    onSelect('');
    setQuery('');
  };

  return (
    <div className="w-full form-group">
      <Combobox value={selectedValue} onChange={onSelect}>
        {({ open }) => (
          <>
            <Combobox.Label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </Combobox.Label>

            <div className="relative">
              <div
                className={`relative w-full cursor-default overflow-hidden rounded-md bg-white text-left sm:text-sm transition-all duration-200 ${
                  touched && error
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
              >
                <Combobox.Input
                  className="w-full py-2.5 pl-3 pr-12 text-sm leading-5 focus-visible:outline-none text-gray-900"
                  placeholder={placeholder}
                  displayValue={(option) =>
                    options.find((opt) => opt.value === option)?.label || ''
                  }
                  onChange={(event) => setQuery(event.target.value)}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
                  {selectedValue && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                  <Combobox.Button className="text-gray-400 hover:text-gray-500 transition-colors">
                    <FiChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </Combobox.Button>
                </div>
              </div>

              {touched && error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}

              <Combobox.Options className="absolute z-[500] mt-1.5 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fadeIn">
                {filteredOptions.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                    No results found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option.value}
                      className={({ active, selected }) =>
                        `relative cursor-default select-none py-2 pl-2 pr-4 transition-colors ${
                          active ? 'bg-blue-50 text-blue-700' : ''
                        }
                         ${
                           selected
                             ? 'font-medium text-blue-900 bg-blue-100'
                             : 'font-normal text-gray-900'
                         }
                         `
                      }
                      value={option.value}
                    >
                      <span>{option.label}</span>
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </div>
          </>
        )}
      </Combobox>
    </div>
  );
};

export default SearchableDropdown;
