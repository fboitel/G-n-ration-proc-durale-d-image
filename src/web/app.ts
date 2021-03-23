const generators = [
    'gen 1',
    'gen 2',
    'gen 3',
];

const filters = [
    'filter 1',
    'filter 2',
    'filter 3',
];

function createOptionGroup(name: string, options: string[]): HTMLOptGroupElement {
    const group = document.createElement('optgroup');
    group.label = name;

    for (const optionName of options) {
        const option = document.createElement('option');
        option.value = optionName;
        option.textContent = optionName;
        group.appendChild(option);
    }

    return group;
}

const select = document.getElementById('generator-and-filters') as HTMLSelectElement
select.appendChild(createOptionGroup('Générateurs', generators))
select.appendChild(createOptionGroup('Filtres', filters))
