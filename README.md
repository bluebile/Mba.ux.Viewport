# Mba.ux.Viewport

Componente da MBA que provê overrides com melhorias para `Ext.viewport.*`, adicionando navegação automática
para evento `backbutton`.


Override do `Ext.viewport.Default` classe utilizada por todas viewports (Android, Ios e WindowsPhone).

- `onBack()` método adicionado que chama Mba.ux.Navigation.back() que é registrado atráves do backbutton;
- `callbackFocus()` método adicionado para corrigir problema do Scroll com teclado para Android;
- `navigation` propriedade que atribui o objeto navigation com configs para mesmo veja exemplo básico abaixo;
- `autonavigation` propriedade que escuta o evento `backbutton` automático e realiza navegação com método Ext.Viewport.setActiveItem() e Ext.Viewport.animateActiveItem();
- `registerOnBack` propriedade que escuta o evento `backbutton` automático.

Exemplo de navegação automática para Ext.Viewport:

```
// config app.js

viewport: {
    xclass: 'Ext.viewport.Viewport',
    autoNavigation: true,
    navigation: {
        xtypesResetable: ['mainview'] // limpa stack essa viewport
    }
},
```


