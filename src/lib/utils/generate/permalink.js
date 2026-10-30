// -- Contains helpers and utilities related to permalinking -- //

// TODO: When implementing adjustible permalinks, ensure this reflects user choices.
export function getPermalink(collection, item, origin = "") {
  const ref = origin.replace(/\/$/, "");
  
  let view = "";
  let edit = `/_cc_admin/${collection}/edit/${item?.id}`;
  let share = "";

  if (collection === "updates") {
    view = `/comic/${item?.slug}`;
    share = ref + view;
  } else if (collection === "chapters") {
    view += `/archive/${collection}/${item?.slug}`;
    share = ref + view;
  } else if (collection === "volumes") {
    view += `/archive/${collection}/${item?.slug}`;
    share = ref + view;
  } else if (collection === "cast") {
    view = `/cast/${item?.slug}`;
    share = ref + view;
  } else if (collection === "blogs") {
    view = `/blog/${item?.slug}`;
    share = ref + view;
  } else if (collection === "gallery") {
    view = `/gallery/${item?.slug}`;
    share = ref + view;
  } else if (collection === "users") {
    edit = `/_cc_admin/users/edit/${item?.id}`;
    view = `/_cc_admin/users/profile/${item?.id}`;
    share = ref + view;
  } else if (collection === "admin") {
    edit = `/_cc_admin/users/edit/${item?.id}`;
    view = `/_cc_admin/users/profile/${item?.id}`;
    share = ref + view;
  } else if (collection === "guests") {
    edit = `/_cc_admin/users/edit-guest/${item?.id}`;
    view = `/_cc_admin/users/profile/${item?.id}`;
    share = ref + view;
  }

  return {
    view,
    edit,
    share,
  }
}