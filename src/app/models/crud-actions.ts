type TAction = 'add' | 'update' | 'delete' | 'none';

export interface IAction<T> {
  item: T;
  action: TAction;
}
