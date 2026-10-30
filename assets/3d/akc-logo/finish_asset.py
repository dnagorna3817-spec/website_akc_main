"""Bake glTF textures, export only the sign, and render the three approval views."""
import bpy, math, json, bmesh
from pathlib import Path
ROOT=Path(__file__).resolve().parent
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'akc-logo.blend'))
scene=bpy.context.scene
scene.render.engine='CYCLES'; scene.cycles.samples=128
scene.cycles.use_denoising=True
try:
    p=bpy.context.preferences.addons['cycles'].preferences
    p.compute_device_type='METAL'; p.get_devices()
    for d in p.devices: d.use=d.type=='METAL'
    scene.cycles.device='GPU' if any(d.type=='METAL' for d in p.devices) else 'CPU'
except Exception: scene.cycles.device='CPU'
logo=bpy.data.objects['AKC | unified interlocking sign']
bpy.ops.object.select_all(action='DESELECT'); logo.select_set(True); bpy.context.view_layer.objects.active=logo
# Non-overlapping UV islands are necessary for portable tangent-space normal maps.
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=.025)
bpy.ops.object.mode_set(mode='OBJECT')
scene.render.bake.margin=12
scene.cycles.samples=16
images={}
for kind in ('NORMAL','ROUGHNESS'):
    image=bpy.data.images.new('AKC '+kind.lower(),width=2048,height=2048,alpha=False)
    image.colorspace_settings.name='Non-Color'
    for mat in logo.data.materials:
        node=mat.node_tree.nodes.new('ShaderNodeTexImage'); node.image=image
        mat.node_tree.nodes.active=node; node.select=True
    print('BAKE_START',kind,flush=True)
    bpy.ops.object.bake(type=kind)
    image.filepath_raw=str(ROOT/('akc-'+kind.lower()+'.png')); image.file_format='PNG'; image.save(); image.pack()
    images[kind]=image
    print('BAKE_COMPLETE',kind,flush=True)

export=logo.copy(); export.data=logo.data.copy(); scene.collection.objects.link(export)
export.name='AKC Logo | glTF'; export.data.materials.clear()
for original in logo.data.materials:
    mat=bpy.data.materials.new(original.name+' | glTF'); mat.use_nodes=True
    nodes=mat.node_tree.nodes; links=mat.node_tree.links
    bs=nodes.get('Principled BSDF'); src=original.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=src.inputs['Base Color'].default_value
    bs.inputs['Metallic'].default_value=1
    rough=nodes.new('ShaderNodeTexImage'); rough.image=images['ROUGHNESS']; links.new(rough.outputs['Color'],bs.inputs['Roughness'])
    normal=nodes.new('ShaderNodeTexImage'); normal.image=images['NORMAL']
    decode=nodes.new('ShaderNodeNormalMap'); links.new(normal.outputs['Color'],decode.inputs['Color']); links.new(decode.outputs['Normal'],bs.inputs['Normal'])
    export.data.materials.append(mat)
export.rotation_euler.x=math.pi/2
bpy.ops.object.select_all(action='DESELECT'); export.select_set(True); bpy.context.view_layer.objects.active=export
bpy.ops.object.transform_apply(location=False,rotation=True,scale=False)
bm=bmesh.new(); bm.from_mesh(export.data)
validation={'vertices':len(bm.verts),'faces':len(bm.faces),'non_manifold_edges':sum(not e.is_manifold for e in bm.edges),'zero_area_faces':sum(f.calc_area()<1e-12 for f in bm.faces),'materials':len(export.data.materials),'device':scene.cycles.device}
bm.free()
bpy.ops.export_scene.gltf(filepath=str(ROOT/'akc-logo.glb'),export_format='GLB',use_selection=True,export_apply=True,export_animations=False,export_cameras=False,export_lights=False,export_tangents=True)
export.hide_render=True; export.hide_viewport=True
scene.cycles.samples=128
scene.render.resolution_x=1440; scene.render.resolution_y=1440
scene.camera=bpy.data.objects['01 | Front Hero']
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'akc-logo.blend'))
for camera,filename in [('01 | Front Hero','hero-preview.png'),('02 | Three-quarter','angle-preview.png'),('03 | Expertise close-up','expertise-preview.png')]:
    scene.camera=bpy.data.objects[camera]
    scene.render.resolution_x=1440; scene.render.resolution_y=1440 if filename!='expertise-preview.png' else 1000
    scene.render.filepath=str(ROOT/filename)
    print('RENDER_START',filename,flush=True)
    bpy.ops.render.render(write_still=True)
    print('RENDER_COMPLETE',filename,flush=True)
(ROOT/'validation.json').write_text(json.dumps(validation,indent=2))
print('ASSET_COMPLETE',validation,flush=True)
