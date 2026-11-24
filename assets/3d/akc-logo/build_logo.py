"""Reproducible standalone Blender asset. Does not import or change website code."""
import bpy, math, json, sys
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
OUTLINE = [
    (640,120),(668,170),(402,612),(856,612),(701,336),(665,397),
    (754,551),(511,551),(704,232),(1192,1080),(1122,1080),
    (872,643),(637,1017),(957,1017),(930,967),(753,967),
    (872,765),(1047,1080),(60,1080),(100,1017),(586,1017),
    (383,643),(214,920),(290,920),(383,765),(491,967),(120,967),
]
HOLES = [ [(634,446),(603,500),(667,500)],
          [(375,860),(343,916),(407,916)],
          [(872,860),(840,916),(904,916)] ]

def xy(p): return ((p[0]-626)/350, (600-p[1])/350)
def signed(points): return sum(a[0]*b[1]-a[1]*b[0] for a,b in zip(points,points[1:]+points[:1]))/2
def material(name, color, rough):
    m=bpy.data.materials.new(name); m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Metallic'].default_value=1
    bs.inputs['Roughness'].default_value=rough
    return m

bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=64
scene.cycles.use_denoising=True
scene.cycles.max_bounces=8
scene.cycles.device='CPU'
devices=[]
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type='METAL'; prefs.get_devices()
    for d in prefs.devices:
        d.use=d.type=='METAL'; devices.append({'name':d.name,'type':d.type})
    if any(d['type']=='METAL' for d in devices): scene.cycles.device='GPU'
except Exception as error: print('METAL_FALLBACK',str(error))
print('RENDER_DEVICES',devices,flush=True)
scene.render.resolution_x=1100; scene.render.resolution_y=1100
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGBA'
scene.view_settings.view_transform='AgX'
scene.view_settings.exposure=.4
scene.world=bpy.data.worlds.new('Dark navy studio'); scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.025,.04,.07,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.22

front=material('AKC | Cobalt anodized titanium',(.032,.10,.23),.28)
edge=material('AKC | Polished chamfer',(.20,.34,.52),.18)
side=material('AKC | Blue graphite walls',(.009,.019,.038),.34)
# Subtle physical relief for Cycles. Export will receive baked normal/roughness.
nodes=front.node_tree.nodes; links=front.node_tree.links; bs=nodes.get('Principled BSDF')
tex=nodes.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value=380
tex.inputs['Detail'].default_value=2; tex.inputs['Roughness'].default_value=.6
coord=nodes.new('ShaderNodeTexCoord'); mapping=nodes.new('ShaderNodeVectorMath'); mapping.operation='MULTIPLY'
mapping.inputs[1].default_value=(1,9,1); links.new(coord.outputs['Generated'],mapping.inputs[0]); links.new(mapping.outputs[0],tex.inputs['Vector'])
ramp=nodes.new('ShaderNodeMapRange'); ramp.inputs['To Min'].default_value=.23; ramp.inputs['To Max'].default_value=.32
links.new(tex.outputs['Fac'],ramp.inputs['Value']); links.new(ramp.outputs['Result'],bs.inputs['Roughness'])
bump=nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.13; bump.inputs['Distance'].default_value=.001
links.new(tex.outputs['Fac'],bump.inputs['Height']); links.new(bump.outputs['Normal'],bs.inputs['Normal'])

curve=bpy.data.curves.new('AKC front contour traced from public PNG','CURVE')
curve.dimensions='2D'; curve.resolution_u=1; curve.fill_mode='BOTH'
curve.extrude=.075; curve.bevel_depth=.009; curve.bevel_resolution=4
for index, contour in enumerate([OUTLINE]+HOLES):
    points=[xy(p) for p in contour]
    if (signed(points)>0) != (index==0): points.reverse()
    spline=curve.splines.new('POLY'); spline.points.add(len(points)-1)
    for point,p in zip(spline.points,points): point.co=(*p,0,1)
    spline.use_cyclic_u=True
logo=bpy.data.objects.new('AKC | unified interlocking sign',curve); scene.collection.objects.link(logo)
bpy.context.view_layer.objects.active=logo; logo.select_set(True)
bpy.ops.object.convert(target='MESH')
for m in (front,side,edge): logo.data.materials.append(m)
for polygon in logo.data.polygons:
    z=abs(polygon.normal.z)
    polygon.material_index=0 if z>.999 else 1 if z<.01 else 2
    polygon.use_smooth=z<.999 and z>.01
# Planar UVs preserve the exact source alignment and are sufficient for tiny grain.
uv=logo.data.uv_layers.new(name='AKC surface UV')
for polygon in logo.data.polygons:
    for li in polygon.loop_indices:
        co=logo.data.vertices[logo.data.loops[li].vertex_index].co
        uv.data[li].uv=((co.x+1.8)/3.6,(co.y+1.8)/3.6)
logo['source']='public/akc-logo-transparent.png; manually traced front-face polygon in build_logo.py'
logo['construction']='One interlocking contour with three internal apertures; no separate central inverted triangle'
logo['approval_status']='Review required; not integrated into website'

# Keep the source image in the editable scene as a hidden alignment reference.
ref=bpy.data.objects.new('REFERENCE | original PNG — hidden in render',None)
ref.empty_display_type='IMAGE'; ref.data=bpy.data.images.load(str(ROOT.parents[2]/'public/akc-logo-transparent.png'))
ref.empty_display_size=3.63; ref.hide_render=True; ref.hide_viewport=True
scene.collection.objects.link(ref); ref.data.pack()

def area(name,location,power,color,size,size_y,target=(0,0,0)):
    data=bpy.data.lights.new(name,'AREA'); data.energy=power; data.color=color; data.shape='RECTANGLE'; data.size=size; data.size_y=size_y
    obj=bpy.data.objects.new(name,data); scene.collection.objects.link(obj); obj.location=location
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
    return obj
area('Key | large cold softbox',(-3,2.5,4),850,(.65,.80,1),3,4)
area('Rim | narrow ice strip',(2.5,1,2),1000,(.25,.50,1),.25,4)
area('Top | polished edge reflection',(0,3,1.5),650,(.75,.88,1),3,.22)
area('Fill | low blue',(-1,-3,3),160,(.27,.43,.7),3,2)
area('Front | reflected soft fill',(.1,.3,5),180,(.65,.75,.9),2.5,2.5)

bpy.ops.mesh.primitive_plane_add(size=200, location=(0,0,-.6))
back=bpy.context.object; back.name='STUDIO | shadow backdrop — not exported'
backmat=material('Studio | ink navy',(.003,.008,.015),.9)
backmat.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value=0
back.data.materials.append(backmat)

def camera(name,pos,target,scale):
    data=bpy.data.cameras.new(name); data.type='ORTHO'; data.ortho_scale=scale
    obj=bpy.data.objects.new(name,data); scene.collection.objects.link(obj); obj.location=pos
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
    return obj
hero=camera('01 | Front Hero',(0,0,7),(0,0,0),3.9)
angle=camera('02 | Three-quarter',(.95,.5,6),(0,0,0),3.9)
close=camera('03 | Expertise close-up',(.3,.05,4),(-.65,.3,0),1.45)
scene.camera=hero
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'akc-logo.blend'))
(ROOT/'geometry-source.json').write_text(json.dumps({'image':'public/akc-logo-transparent.png','canvas':[1270,1239],'outline_pixels':OUTLINE,'holes_pixels':HOLES,'devices':devices},indent=2))
scene.render.filepath=str(ROOT/'hero-preview.png')
bpy.ops.render.render(write_still=True)
print('HERO_RENDER_COMPLETE',flush=True)
