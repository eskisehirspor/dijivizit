import cv2, numpy as np, sys, json
from PIL import Image, ImageFilter

TEX='/home/claude/dijivizit/render/tex'
FIN={
 'black': dict(base=(26,26,29), etch=(150,150,156), noise=6),
 'silver': dict(base=(178,179,183), etch=(58,58,62), noise=10),
 'gold': dict(base=(196,156,92), etch=(86,62,28), noise=10),
 'wood': dict(img='wood-dark.jpg', etch=(38,20,10)),
 'wood-light': dict(img='wood-light.jpg', etch=(70,45,25)),
}

def face(finish, W=1712, H=1080, side='front'):
    f=FIN[finish]
    mask=Image.open(f'{TEX}/card-{side}.png').convert('L').resize((W,H),Image.LANCZOS)
    m=np.asarray(mask).astype(np.float32)[...,None]/255.
    if 'img' in f:
        base=np.asarray(Image.open(f'{TEX}/{f["img"]}').convert('RGB').resize((W,H),Image.LANCZOS)).astype(np.float32)
    else:
        base=np.ones((H,W,3),np.float32)*np.array(f['base'],np.float32)
        # brushed streaks along the long side
        rng=np.random.default_rng(1)
        n=rng.normal(0,1,(H,1)).astype(np.float32)
        n=cv2.GaussianBlur(np.repeat(n,W,1),(0,0),sigmaX=40,sigmaY=0.6)
        base+=n[...,None]*f['noise']
    etch=np.array(f['etch'],np.float32)
    out=base*(1-m)+etch*m
    return np.clip(out,0,255).astype(np.uint8)

def rounded_mask(W,H,r):
    m=np.zeros((H,W),np.uint8)
    cv2.rectangle(m,(r,0),(W-r,H),255,-1); cv2.rectangle(m,(0,r),(W,H-r),255,-1)
    for cx,cy in [(r,r),(W-r,r),(r,H-r),(W-r,H-r)]: cv2.circle(m,(cx,cy),r,255,-1,cv2.LINE_AA)
    return m

def composite(photo, quad, finish, card_mask_fn, out, side='front', shade_strength=1.0, radius=0.04):
    img=np.asarray(Image.open(photo).convert('RGB')).astype(np.float32)
    H,W=img.shape[:2]
    tw,th=1712,1080
    tex=face(finish,tw,th,side).astype(np.float32)
    rm=rounded_mask(tw,th,int(th*radius)).astype(np.float32)/255.
    src=np.float32([[0,0],[tw,0],[tw,th],[0,th]])
    M=cv2.getPerspectiveTransform(src,np.float32(quad))
    warped=cv2.warpPerspective(tex,M,(W,H),flags=cv2.INTER_CUBIC)
    wm=cv2.warpPerspective(rm,M,(W,H),flags=cv2.INTER_LINEAR)
    # lighting from the original card: luminance relative to its mean
    lum=img.mean(2)
    occl=card_mask_fn(img)  # 1 where original pixel looks like the card
    inside=(wm>0.5)
    ref=lum[inside & (occl>0.5)].mean()
    shade=cv2.GaussianBlur(lum,(0,0),18)/max(ref,1)
    shade=1+(shade-1)*shade_strength
    shaded=warped*np.clip(shade,0.5,1.8)[...,None]
    occl=cv2.GaussianBlur(occl.astype(np.float32),(0,0),1.2)
    alpha=(wm*occl)[...,None]
    res=img*(1-alpha)+shaded*alpha
    Image.fromarray(np.clip(res,0,255).astype(np.uint8)).save(out)
    return res

def detect_quad(photo, sel):
    img=np.asarray(Image.open(photo).convert('RGB'))
    m=(sel(img.astype(np.float32))*255).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    c=max(cs,key=cv2.contourArea)
    hull=cv2.convexHull(c)
    for eps in np.linspace(0.005,0.06,40):
        ap=cv2.approxPolyDP(hull,eps*cv2.arcLength(hull,True),True)
        if len(ap)==4: break
    return ap.reshape(-1,2).tolist()

def etch_overlay(photo, quad, mask_png, color, out, occl_fn, strength=0.92, crop=None):
    img=np.asarray(Image.open(photo).convert('RGB')).astype(np.float32)
    H,W=img.shape[:2]
    mk=np.asarray(Image.open(mask_png).convert('L')).astype(np.float32)/255.
    mh,mw=mk.shape
    M=cv2.getPerspectiveTransform(np.float32([[0,0],[mw,0],[mw,mh],[0,mh]]),np.float32(quad))
    wm=cv2.warpPerspective(mk,M,(W,H),flags=cv2.INTER_AREA if mw>W else cv2.INTER_CUBIC)
    lum=img.mean(2)
    shade=cv2.GaussianBlur(lum,(0,0),25)
    occ=cv2.GaussianBlur(occl_fn(img).astype(np.float32),(0,0),1.0)
    ref=np.percentile(shade[occ>0.5],50)
    s=np.clip(shade/ref,0.6,1.6)[...,None]
    col=np.array(color,np.float32)*s
    a=(wm*occ*strength)[...,None]
    res=img*(1-a)+col*a
    res=Image.fromarray(np.clip(res,0,255).astype(np.uint8))
    if crop: res=res.crop(crop)
    res=res.resize((1080,1350),Image.LANCZOS) if crop else res
    res.save(out); return res

R='/root/.claude/projects/-home-claude/a3eeae4c-8f16-5b59-a424-37b4f8932efb/tool-results/mcp-remote-devices-blob-'
def stitch(tiles, size, crop, out):
    c=Image.new('RGB',size)
    for (x,y),f in tiles: c.paste(Image.open(R+f+'.jpg').convert('RGB'),(x,y))
    c=c.crop(crop); c.save(out); return c

def face_from_mask(finish, mask_png):
    f=FIN[finish]
    mk=np.asarray(Image.open(mask_png).convert('L')).astype(np.float32)/255.
    H,W=mk.shape
    if 'img' in f:
        base=np.asarray(Image.open(f'{TEX}/{f["img"]}').convert('RGB').resize((W,H),Image.LANCZOS)).astype(np.float32)
    else:
        base=np.ones((H,W,3),np.float32)*np.array(f['base'],np.float32)
        rng=np.random.default_rng(3)
        n=rng.normal(0,1,(H,1)).astype(np.float32)
        n=cv2.GaussianBlur(np.repeat(n,W,1),(0,0),sigmaX=60,sigmaY=0.7)
        base+=n[...,None]*f['noise']
        # soft metallic sheen across the face
        g=np.linspace(-1,1,W)[None,:]*0.5+np.linspace(-1,1,H)[:,None]*0.5
        base*= (1+0.10*np.exp(-((g-0.15)**2)/0.08))[...,None] if finish!='black' else 1
    out=base*(1-mk[...,None])+np.array(f['etch'],np.float32)*mk[...,None]
    return np.clip(out,0,255)

def replace_face(photo, quad, finish, mask_png, out, card_sel, radius=0.012, shade_gamma=1.0, crop=None, tint_keep=0.0):
    img=np.asarray(Image.open(photo).convert('RGB')).astype(np.float32)
    H,W=img.shape[:2]
    tex=face_from_mask(finish, mask_png); th,tw=tex.shape[:2]
    rm=rounded_mask(tw,th,max(1,int(th*radius))).astype(np.float32)/255.
    M=cv2.getPerspectiveTransform(np.float32([[0,0],[tw,0],[tw,th],[0,th]]),np.float32(quad))
    warped=cv2.warpPerspective(tex,M,(W,H),flags=cv2.INTER_AREA,borderMode=cv2.BORDER_REPLICATE)
    wm=cv2.warpPerspective(rm,M,(W,H),flags=cv2.INTER_LINEAR)
    lum=img.mean(2)
    sel=card_sel(img).astype(np.float32)
    inside=(wm>0.5)&(sel>0.5)
    ref=np.median(lum[inside])
    shade=cv2.GaussianBlur(lum,(0,0),12)/max(ref,1)
    shade=np.clip(shade,0.45,1.5)**shade_gamma
    res_card=warped*shade[...,None]
    occ=cv2.GaussianBlur(sel,(0,0),1.0)
    # dilate card region slightly so the old card's anti-aliased rim disappears
    a=(np.clip(wm,0,1)*occ)[...,None]
    res=img*(1-a)+res_card*a
    res=Image.fromarray(np.clip(res,0,255).astype(np.uint8))
    if crop: res=res.crop(crop).resize((1080,1350),Image.LANCZOS)
    res.save(out); return res

def skin_mask(img):
    ycc=cv2.cvtColor(np.clip(img,0,255).astype(np.uint8),cv2.COLOR_RGB2YCrCb).astype(np.float32)
    cr,cb=ycc[...,1],ycc[...,2]
    m=((cr>133)&(cr<185)&(cb>75)&(cb<135)).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    return m.astype(np.float32)

def replace_face2(photo, quad, finish, mask_png, out, radius=0.012, crop=None, occluder=None, rim=0.35, sheen=0.12, shade_strength=1.0, dilate=3, blur=0, tex_override=None):
    img=np.asarray(Image.open(photo).convert('RGB')).astype(np.float32)
    H,W=img.shape[:2]
    tex=face_from_mask(finish, mask_png) if tex_override is None else tex_override; th,tw=tex.shape[:2]
    # subtle diagonal sheen so flat colours read as a physical surface
    yy,xx=np.mgrid[0:th,0:tw].astype(np.float32)
    d=(xx/tw*0.7+yy/th*0.3)
    tex=tex*(1+sheen*np.exp(-((d-0.35)**2)/0.03))[...,None]
    rm=rounded_mask(tw,th,max(1,int(th*radius))).astype(np.float32)/255.
    edge=cv2.morphologyEx(rm,cv2.MORPH_GRADIENT,np.ones((7,7),np.uint8))
    M=cv2.getPerspectiveTransform(np.float32([[0,0],[tw,0],[tw,th],[0,th]]),np.float32(quad))
    warped=cv2.warpPerspective(tex,M,(W,H),flags=cv2.INTER_AREA,borderMode=cv2.BORDER_REPLICATE)
    wm=cv2.warpPerspective(rm,M,(W,H),flags=cv2.INTER_LINEAR)
    we=cv2.warpPerspective(edge,M,(W,H),flags=cv2.INTER_LINEAR)
    wmd=cv2.dilate(wm,np.ones((dilate,dilate),np.uint8)) if dilate else wm
    lum=cv2.medianBlur(np.clip(img.mean(2),0,255).astype(np.uint8),31).astype(np.float32)
    occ=occluder(img) if occluder is not None else skin_mask(img)
    occ=cv2.erode(occ,np.ones((5,5),np.uint8))
    occ=cv2.GaussianBlur(occ,(0,0),1.0)
    inside=(wm>0.5)&(occ<0.5)
    ref=np.median(lum[inside])
    shade=cv2.GaussianBlur(lum,(0,0),14)/max(ref,1)
    shade=1+(np.clip(shade,0.45,1.5)-1)*shade_strength
    card=warped*shade[...,None]
    card=card+(255-card)*(we*rim)[...,None]*0.6
    if blur:
        card=cv2.GaussianBlur(card,(0,0),blur); wmd=cv2.GaussianBlur(wmd,(0,0),blur*0.7)
    a=(np.clip(wmd,0,1)*(1-occ))[...,None]
    res=img*(1-a)+card*a
    res=Image.fromarray(np.clip(res,0,255).astype(np.uint8))
    if crop: res=res.crop(crop).resize((1080,1350),Image.LANCZOS)
    res.save(out); return res

def replace_unmix(photo, quad, finish, mask_png, out, card_white=None, lo=105, hi=185, radius=0.012, crop=None, rim=0.25, sheen=0.12, core_erode=11, dilate=7, shade_strength=1.0, light_card=True, tex_override=None):
    """For light (white/pale) cards: estimate per-pixel card coverage from
    brightness and swap the card's colour out, so fingers keep their soft edges."""
    img=np.asarray(Image.open(photo).convert('RGB')).astype(np.float32)
    H,W=img.shape[:2]
    tex=face_from_mask(finish, mask_png) if tex_override is None else tex_override; th,tw=tex.shape[:2]
    yy,xx=np.mgrid[0:th,0:tw].astype(np.float32)
    d=(xx/tw*0.7+yy/th*0.3)
    tex=tex*(1+sheen*np.exp(-((d-0.35)**2)/0.03))[...,None]
    rm=rounded_mask(tw,th,max(1,int(min(th,tw)*radius))).astype(np.float32)/255.
    edge=cv2.morphologyEx(rm,cv2.MORPH_GRADIENT,np.ones((7,7),np.uint8))
    M=cv2.getPerspectiveTransform(np.float32([[0,0],[tw,0],[tw,th],[0,th]]),np.float32(quad))
    warped=cv2.warpPerspective(tex,M,(W,H),flags=cv2.INTER_AREA,borderMode=cv2.BORDER_REPLICATE)
    wm=cv2.warpPerspective(rm,M,(W,H),flags=cv2.INTER_LINEAR)
    we=cv2.warpPerspective(edge,M,(W,H),flags=cv2.INTER_LINEAR)
    wmd=cv2.dilate(wm,np.ones((dilate,dilate),np.uint8))
    minc=img.min(2) if light_card else 255-img.max(2)
    a=np.clip((minc-lo)/(hi-lo),0,1)
    core=cv2.erode(np.maximum(skin_mask(img),skin_hsv(img).astype(np.float32)),np.ones((core_erode,core_erode),np.uint8))
    core=cv2.GaussianBlur(core,(0,0),2)
    a=a*(1-core)*np.clip(wmd,0,1)
    lum=img.mean(2)
    inside=(wm>0.5)&(a>0.95)
    ref=np.median(lum[inside])
    shade=cv2.GaussianBlur(lum,(0,0),14)/max(ref,1)
    shade=1+(np.clip(shade,0.45,1.5)-1)*shade_strength
    card=warped*shade[...,None]
    card=card+(255-card)*(we*rim)[...,None]*0.6
    whiteref=cv2.GaussianBlur(img*(inside[...,None]),(0,0),25)/np.maximum(cv2.GaussianBlur(inside.astype(np.float32),(0,0),25),1e-3)[...,None]
    res=img + a[...,None]*(card - whiteref)
    # pixels fully inside: just the card
    res=Image.fromarray(np.clip(res,0,255).astype(np.uint8))
    if crop: res=res.crop(crop).resize((1080,1350),Image.LANCZOS)
    res.save(out); return res

def recolor_band(result_png, orig_png, quad, pred, color, out, grow=16, crop=None):
    res=np.asarray(Image.open(result_png).convert('RGB')).astype(np.float32)
    orig=np.asarray(Image.open(orig_png).convert('RGB')).astype(np.float32)
    H,W=orig.shape[:2]
    m=np.zeros((H,W),np.uint8); cv2.fillConvexPoly(m,np.int32(quad),255)
    band=(cv2.dilate(m,np.ones((grow,grow),np.uint8))>0)&~(cv2.erode(m,np.ones((5,5),np.uint8))>0)
    p=pred(orig)&band
    p=cv2.GaussianBlur(p.astype(np.float32),(0,0),0.8)
    lum=orig.mean(2,keepdims=True)/max(orig[p>0.5].mean(),1) if (p>0.5).any() else 1
    col=np.array(color,np.float32)*np.clip(lum,0.4,1.6)
    if res.shape!=orig.shape: raise SystemExit('size mismatch')
    out_img=res*(1-p[...,None])+col*p[...,None]
    im=Image.fromarray(np.clip(out_img,0,255).astype(np.uint8))
    if crop: im=im.crop(crop).resize((1080,1350),Image.LANCZOS)
    im.save(out); return im

def hand_mask(img, quad, shrink=6):
    """Skin regions that reach outside the card (fingers), not skin-coloured print on it."""
    sk=skin_mask(img).astype(np.uint8)
    H,W=sk.shape
    inner=np.zeros((H,W),np.uint8); cv2.fillConvexPoly(inner,np.int32(quad),1)
    inner=cv2.erode(inner,np.ones((shrink*2+1,shrink*2+1),np.uint8))
    n,lab=cv2.connectedComponents(sk)
    keep=np.zeros_like(sk)
    for i in range(1,n):
        comp=lab==i
        if (comp & (inner==0)).sum()>200: keep[comp]=1
    return keep.astype(np.float32)

def skin_hsv(img):
    hsv=cv2.cvtColor(np.clip(img,0,255).astype(np.uint8),cv2.COLOR_RGB2HSV).astype(np.float32)
    h,s,v=hsv[...,0]*2,hsv[...,1]/255,hsv[...,2]/255
    m=(((h<24)|(h>340))&(s>0.12)&(s<0.68)&(v>0.2)).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    return m

def hand_mask2(img, quad, shrink=6, min_out=200):
    sk=skin_hsv(img)
    H,W=sk.shape
    inner=np.zeros((H,W),np.uint8); cv2.fillConvexPoly(inner,np.int32(quad),1)
    inner=cv2.erode(inner,np.ones((shrink*2+1,shrink*2+1),np.uint8))
    n,lab=cv2.connectedComponents(sk)
    keep=np.zeros_like(sk)
    for i in range(1,n):
        comp=lab==i
        if (comp & (inner==0)).sum()>min_out: keep[comp]=1
    return keep.astype(np.float32)
