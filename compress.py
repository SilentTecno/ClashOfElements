import subprocess

scripts = []
scripts.append('scripts/game.js')
scripts.append('scripts/game.common.js')
scripts.append('scripts/game.shape.js')
scripts.append('scripts/game.cursor.js')
scripts.append('scripts/game.player.js')
scripts.append('scripts/game.keySet.js')
scripts.append('scripts/game.element.js')
scripts.append('scripts/game.bullet.js')
scripts.append('scripts/game.building.js')
scripts.append('scripts/game.canvas.js')
scripts.append('scripts/game.cpu.js')
scripts.append('scripts/game.sound.js')
scripts.append('scripts/game.bufferLoader.js')
scripts.append('scripts/game.collisionHelper.js')
scripts.append('scripts/index.js')

print 'Merge scripts ...'

with open('scripts/index.min.js', 'w') as outfile:
    for script in scripts:
        with open(script) as infile:
            outfile.write(infile.read())

print 'Merge styles ...'

styles = ['styles/site.css']
with open('styles/site.min.css', 'w') as outfile:
    for style in styles:
        with open(style) as infile:
            outfile.write(infile.read())

print 'Minify scripts ...'

subprocess.call(['java', '-jar', 'yuicompressor-2.4.8.jar', '-o', 'scripts/index.min.js', '--type', 'js', 'scripts/index.min.js'])

print 'Minify styles ...'

subprocess.call(['java', '-jar', 'yuicompressor-2.4.8.jar', '-o', 'styles/site.min.css', '--type', 'css', 'styles/site.css'])

print 'Delete zip files and folder ...'

subprocess.call(['rm', '-f', 'game_7z.zip'])
subprocess.call(['rm', '-f', 'game_zip.zip'])
subprocess.call(['rm', '-rf', 'gameZip'])

print 'Create zip folder ...'

subprocess.call(['mkdir', '-p', 'gameZip'])
subprocess.call(['cp', 'index.html', 'gameZip/index.html'])
subprocess.call(['mkdir', '-p', 'gameZip/scripts'])
subprocess.call(['cp', 'scripts/index.min.js', 'gameZip/scripts/index.min.js'])
subprocess.call(['mkdir', '-p', 'gameZip/styles'])
subprocess.call(['cp', 'styles/site.min.css', 'gameZip/styles/site.min.css'])
subprocess.call(['mkdir', '-p', 'gameZip/images'])
subprocess.call(['cp', '-r', 'images/', 'gameZip/'])
subprocess.call(['mkdir', '-p', 'gameZip/sfx'])
subprocess.call(['cp', '-r', 'sfx/', 'gameZip/'])


print 'Compress ...'

subprocess.call(['7z', 'a', '-tzip', '-mx9', 'game_7z.zip', 'gameZip'])
subprocess.call(['zip', '-r9', 'game_zip.zip', 'gameZip'])
subprocess.call(['rm', '-rf', 'gameZip'])

print 'Done.'