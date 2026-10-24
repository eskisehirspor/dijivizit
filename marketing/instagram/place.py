import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance

def load_cut(name, rot=0, scale=1.0):
    im=Image.open(f'/tmp/claude-0/cut/{name}.png').convert('RGBA')
    im=im.crop(im.getbbox())
    if rot: im=im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if scale!=1: im=im.resize((int(im.width*scale),int(im.height*scale)),Image.LANCZOS)
    return im

def place(bg, card, center, shadow=(0,40), shadow_blur=40, shadow_alpha=0.45, glow=None, blur=0, tone=1.0):
    bg=bg.convert('RGBA')
    x=int(center[0]-card.width/2); y=int(center[1]-card.height/2)
    if shadow_alpha>0:
        a=np.asarray(card.split()[-1]).astype(np.float32)/255
        sh=Image.fromarray((a*255*shadow_alpha).astype(np.uint8))
        pad=shadow_blur*3
        s=Image.new('L',(card.width+pad*2,card.height+pad*2),0); s.paste(sh,(pad,pad))
        s=s.filter(ImageFilter.GaussianBlur(shadow_blur))
        black=Image.new('RGBA',s.size,(0,0,0,255)); black.putalpha(s)
        bg.alpha_composite(black,(x-pad+shadow[0],y-pad+shadow[1]))
    if glow:
        col,rad,strength=glow
        a=card.split()[-1]
        pad=rad*3
        g=Image.new('L',(card.width+pad*2,card.height+pad*2),0); g.paste(a,(pad,pad))
        g=g.filter(ImageFilter.GaussianBlur(rad)).point(lambda v:int(min(255,v*strength)))
        layer=Image.new('RGBA',g.size,col+(255,)); layer.putalpha(g)
        bg.alpha_composite(layer,(x-pad,y-pad))
    c=card
    if tone!=1.0: c=ImageEnhance.Brightness(c).enhance(tone)
    if blur: c=c.filter(ImageFilter.GaussianBlur(blur))
    bg.alpha_composite(c,(x,y))
    return bg
