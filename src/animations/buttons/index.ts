import anim_menuButton from './menu'

const anim_buttons = (ctx: any) => {
  const isDesktop = ctx.conditions.desktop
  if (!isDesktop) return

  anim_menuButton(ctx)
}

export default anim_buttons
