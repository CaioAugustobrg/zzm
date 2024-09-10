interface GroupProps {
  groupName?: string;
  page?: number;
  pageSize?: number;
}

export class Group  {
 public groupName?: string;
 public page?: number;
 public pageSize?: number;
  constructor(props: GroupProps) {
    this.groupName = props.groupName
    this.page = props.page
    this.pageSize = props.pageSize
  }
}
