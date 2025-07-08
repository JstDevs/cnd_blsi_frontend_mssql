import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { FiChevronDown, FiX, FiCheck } from 'react-icons/fi';

const SearchableDropdown = ({ options, label, placeholder = 'Search...' }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.toLowerCase().includes(query.toLowerCase());
        });

  const clearSelection = () => {
    setSelectedOption(null);
    setQuery('');
  };

  return (
    <div className="w-full max-w-xs">
      <Combobox value={selectedOption} onChange={setSelectedOption}>
        {({ open }) => (
          <>
            <Combobox.Label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </Combobox.Label>

            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left shadow-sm sm:text-sm transition-all duration-200">
                <Combobox.Input
                  className="w-full border rounded-md border-gray-300 py-2.5 pl-3 pr-10 text-sm leading-5 focus-visible:outline-none text-gray-900 "
                  placeholder={placeholder}
                  displayValue={(option) => option || ''}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
                  {selectedOption && (
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

              <Combobox.Options className="absolute z-50 mt-1.5 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fadeIn">
                {filteredOptions.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                    No results found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
                          active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                        }`
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {option}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-blue-600' : 'text-blue-500'
                              }`}
                            >
                              <FiCheck className="h-5 w-5" />
                            </span>
                          ) : null}
                        </>
                      )}
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
