## NextJS 14 Server Actions and Supabase + Auth

<p align="center">
 <img src="REPLACE_ME" width="400">
</p>

In this repo is a simple implementation of a minimal todo app, used for task purposes, Features include:

- NextJS 14 Server Actions (and drawbacks)
- Supabase Auth and Database
- useOptimistic
- Optimisitc Updates
- Auth and oAuth (GitHub)

## Notes

- The project is connected to a newly created project by me on your supabase account called fayadXezeats.
- Optimistic updates implemented in editing the task name using `useOptimistic` which updates the ui in real time while the server is processing the request. if the request fails, the ui will revert to its previous state.
- the toasts will show up when the request is done processing.

## Getting Started

```bash
npm install
npm run dev
```
