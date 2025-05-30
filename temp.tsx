interface BaseRuiSelectProps {
  options: [];
}

/**
 * Параметры компонента наследуют все базовые параметры Select'a кроме опций
 *
 * Поддерживает режимы как на multi-select и single-select
 */
interface OrganizationSelectProps extends Omit<BaseRuiSelectProps, 'options'> {
  /**
   * Пермишен, который необходим для совершения действия
   */
  permission: string;
}

/**
 * ['Москва', 'Питер', 'Алушта']
 * const availableOrganizations = useAvailableOrganizations();
 * const feedCatOrganizations = useOrganizationsForPermission('feedCat') // Питер
 */

/**
 * ['Питер']
 * const availableOrganizations = useAvailableOrganizations();
 * const feedCatOrganizations = useOrganizationsForPermission('feedCat') // Питер
 */

/**
 * Просто инпут, который предоставляет готовую обертку над: пермишеннами пользователя и доступными ему организациями; и предоставляет селект с их выбором
 *
 * Сценарий:
 * Если у пользователя всего 1 организация для этого разрешения, то перенести он и не сможет в другую (инпут спрятан). Иначе сможет убрать старую и добавить новую (инпут виден и доступен к взаимодействию).
 * Если у пользователя вообще нет доступа к редактированию нет по этому объекту, то он и в форму не должен попасть (до отрисовки селекта не дошло дело)
 *
 * Содержит те организации, в которых у пользователя есть указанный пермишен. Выбор среди **доступных организаций**
 *
 * Отвечает за:
 * 1. формирование корректного набора options для отображения в выборе Select'a
 * 2.
 * @example
 * ```tsx
 * <OrganizationSelect
 *  label="Organization"
 *  permission={isEditPage ? "editWorkload":"createWorkload"}
 * />
 * ```
 */

/**
 * | Moscow Workload 1 |              |
 * | Moscow Workload 2 |              | - вопрос, а кто мне даст пизды, если я просто по id перейду. Это нужно на фронте проверять, что у меня есть доступ к этой организации и выполнять редирект.
 * | Piter Workload 1 | <EditButton> |
 */

/**
 * const permissonMap = new Map<string, string[]>([
 *   "getWorkload": ['Питер','Москва'],
 *   "editWorkload": ['Питер'],
 * ])
 * @param {string} permission
 * @return {string | null}
 * @constructor
 */

export function OrganizationSelect({ permission }: OrganizationSelectProps) {
  const isSuperAdmin = useIsSuperAdmin();
  const availableOrganizations = useAvailableOrganizations();
  const { checkFor } = useOrganizationPermissions();

  const options = useMemo(() => {
    // имеем выбор среди всех доступных организаций
    if (isSuperAdmin) {
      return availableOrganizations;
    }

    return availableOrganizations.filter((it) =>
      checkFor(it, permission, 'any',
      ));
  }, [isSuperAdmin, permission]);

  if (options.length === 1) {
    // form.[inputName] value to this single selectedOrganizations.length
    return null;
  }

  return "Select component"
}

interface ControlledOrganizationSelectProps
  extends Omit<OrganizationSelectProps, 'value' | 'onChange'> {}

/**
 * Такой же компонент как OrganizationSelect, но с привязкой к методам формы
 */
export function ControlledOrganizationSelect({}: ControlledOrganizationSelectProps) {}
